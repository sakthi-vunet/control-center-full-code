import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import SearchBar from '@mkyy/mui-search-bar';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import axios from 'axios';

import url_backend from '../configs/url';
import { AuthContext } from '../context/AuthContext';
import { HostsData } from '../models/HostData';
import { Service } from '../models/HostData';
import { HostsEditLanding } from './HostsEditLanding';
import { HostsInfoLanding } from './HostsViewLanding';

// migrate services interface
// p is list of services for which migration is possible
// np is list of services for which migration is not possible
export interface MigrateServicesListData {
  p: string[];
  np: string[];
}

// delete host call
const deleteHost = async (data) => {
  const request_url = url_backend + '/api/hosts/';
  try {
    const response = await axios({
      method: 'put',
      url: request_url,
      data: data,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

// comparator for table column
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

// comparator for column
function getComparator<Key extends keyof HostsData>(
  order: Order,
  orderBy: Key
): (a: HostsData, b: HostsData) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Headcell props
interface HeadCell {
  disablePadding: boolean;
  id: keyof HostsData;
  label: string;
  numeric: boolean;
}

// headcell column information
const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Name',
  },
  {
    id: 'Running_services',
    numeric: true,
    disablePadding: false,
    label: 'services/containers',
  },
  {
    id: 'services',
    numeric: false,
    disablePadding: false,
    label: 'Services',
  },
  {
    id: 'health_status',
    numeric: false,
    disablePadding: false,
    label: 'Health Status',
  },
];

// Table head features
interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof HostsData
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof HostsData) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          {/* Checkbox  */}
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all hosts',
            }}
          />
        </TableCell>
        {/* Table columns head */}
        {headCells.map((headCell) =>
          headCell.id !== 'services' ? (
            <TableCell
              key={headCell.id}
              align="left" //{headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ) : (
            <TableCell
              key={headCell.id}
              align="left" //{headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
            >
              {headCell.label}
            </TableCell>
          )
        )}

        {/* Action table column */}
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
  );
}

export const HostsTable: React.FC<{ data: HostsData[] }> = ({ data }) => {
  const navigate = useNavigate();

  // handles route change to host view
  const routeChangeView = (name: string) => {
    const path = `/app/controlcenter/HostsInfo`;
    navigate(path, { state: { id: name } });
  };
  // handles route change to host edit
  const routeChangeEdit = (name: string) => {
    const path = `/app/controlcenter/EditHosts`;
    navigate(path, { state: { id: name } });
  };

  // checks current user and configures privelege level

  const { user } = React.useContext(AuthContext);
  const [level, setLevel] = React.useState(() =>
    user['username'] === 'admin' ? 1 : 0
  );

  //  table column features
  const [orderBy, setOrderBy] = React.useState<keyof HostsData>('name');
  const [order, setOrder] = React.useState<Order>('asc');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searched, setSearched] = React.useState<string>('');

  //  set searched rows
  const [rows1, setRows1] = React.useState<HostsData[]>(data);

  const [numSelected, setNums] = React.useState(0);

  React.useEffect(() => {
    setRows1(data);
    setNums(selected.length);
  }, [data, selected.length]);

  // List pf services that can be migrated
  const [migrateList, setMigrateList] =
    React.useState<MigrateServicesListData>();

  // handles search
  const requestSearch = (searchedVal: string) => {
    const filteredRows = data.filter((row) => {
      return row.name.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setRows1(filteredRows);
  };

  //  handles sort
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof HostsData
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // handles multiple row selection
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows1.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  // handles single row selection
  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  // handles table page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // handles pagination
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // handles host view route change
  const handleHostsView = (event: React.MouseEvent<unknown>, name: string) => {
    console.log(name + 'View');
    event.preventDefault();
    event.stopPropagation();
    routeChangeView(name);
  };

  // type of services running on a host grouped
  const [typeData, setTypeData] = React.useState<{ [key: string]: any }>({});

  // host data to be deleted
  const [hostobjDelete, sethostobjDelete] = React.useState<HostsData>();

  // handles deletion of host
  const handleHostsDelete = (
    event: React.MouseEvent<unknown>,
    hostobj: HostsData
  ) => {
    sethostobjDelete(hostobj);
    // no services running then delete host called
    if (JSON.stringify(hostobj['services']) === JSON.stringify([])) {
      alert('host has no service running on it. Deletion will be done');
      deleteHost('delete$' + hostobj['name']);
    }
    // has few services running then migrate services option is displayed
    else {
      HostServiceTypes(hostobj);

      handleClickOpen();
    }
    event.preventDefault();
    event.stopPropagation();
  };

  // route to add host page
  const routeChangeAddHosts = () => {
    const path = `/app/controlcenter/AddHosts`;
    navigate(path);
  };

  // handles host edit page redirection
  const handleHostsEdit = (event: React.MouseEvent<unknown>, name: string) => {
    console.log(name + 'Edit');
    event.preventDefault();
    event.stopPropagation();
    routeChangeEdit(name);
  };

  // selected rows parameter
  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  // returns service name and its number of instances running on that host in ()
  // for table column "Services"
  const getServices = (row: Service[]) => {
    let str = '';
    for (let i = 0; i < row.length; i++) {
      str = str + row[i].Name + '(' + JSON.stringify(row[i].Instances) + ')';
      if (i !== row.length - 1) str = str + ',';
    }
    return str;
  };

  // handles table row selection
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // handles migrate options for deletion
  const [migrateopen, setMigrateOpen] = React.useState(false);

  const handleMigrateOpen = () => {
    handleClose();
    setMigrateOpen(true);
    console.log('host obj from migrate' + JSON.stringify(hostobjDelete));
    handleMigrate(hostobjDelete);
    console.log('Migrate List' + JSON.stringify(migrateList));
  };

  const handleMigrateClose = () => {
    setMigrateOpen(false);
  };

  // put request to get services that can be migrated
  async function handleMigrate(hostobj) {
    const request_url = url_backend + '/api/migrateservices/';
    try {
      const response = await axios({
        method: 'put',
        url: request_url,
        data: JSON.stringify(hostobj),
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMigrateList(response.data);
      console.log('Response' + response.data);
    } catch (error) {
      console.log(error);
    }
  }

  // groups services into deployment types
  async function HostServiceTypes(data) {
    let temp = '';
    const request_url = url_backend + '/api/servicetypes/';

    try {
      const response = await axios({
        method: 'put',
        url: request_url,
        data: JSON.stringify(data),
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      temp = JSON.stringify(response.data);
      setTypeData(response.data);
    } catch (error) {
      console.log(error);
      temp = 'failed';
    }
    console.log(temp);
    return temp;
  }

  // handles privelege actions
  const handlePrivelege = (event: React.MouseEvent<unknown>) => {
    event.preventDefault();
    event.stopPropagation();
    alert('Operation not permitted.');
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(numSelected > 0 && {
              bgcolor: (theme) =>
                alpha(
                  theme.palette.primary.main,
                  theme.palette.action.activatedOpacity
                ),
            }),
          }}
        >
          {numSelected > 0 ? (
            <Typography
              sx={{ flex: '1 1 100%' }}
              color="inherit"
              variant="subtitle1"
              component="div"
            >
              {numSelected} selected
            </Typography>
          ) : (
            <Typography
              sx={{ flex: '1 1 100%' }}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              Hosts
            </Typography>
          )}
          {numSelected > 0 ? (
            <Tooltip title="Delete">
              <IconButton>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <>
              {/* Search BAr */}
              <SearchBar
                value={searched}
                onChange={(searchVal) => requestSearch(searchVal)}
              />
              {/* Add Host PAge Button */}
              <Tooltip title="Add Host">
                <IconButton
                  onClick={
                    level === 1
                      ? routeChangeAddHosts
                      : (event) => {
                          handlePrivelege(event);
                        }
                  }
                >
                  <AddCircleOutlineRoundedIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Toolbar>
        {/* <span style={{marginLeft:'.001rem'}}/> */}
        <Paper sx={{ width: '20%', textAlign: 'center' }}></Paper>
        {/* <span style={{marginLeft:'.5rem'}}/> */}
        <TableContainer>
          <Table
            sx={{ minWidth: 70, overflowX: 'hidden' }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows1.length}
            />

            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
              rows.slice().sort(getComparator(order, orderBy)) */}
              {rows1
                .slice()
                .sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      {/* Host name */}
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="checkbox"
                        align="left"
                      >
                        {row.name}
                      </TableCell>
                      {/* #of services running / # of containers running */}
                      <TableCell align="left">
                        {JSON.stringify(row.Running_services) +
                          '/' +
                          JSON.stringify(row.Running_instances)}
                      </TableCell>
                      {/* services and their instances list */}
                      <TableCell
                        align="left"
                        sx={{
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                        }}
                      >
                        {getServices(row.services)}
                      </TableCell>
                      {/* health of host */}
                      <TableCell align="left">{row.health_status}</TableCell>
                      {/* Actions on host data */}
                      <TableCell align="left">
                        <Tooltip title="Hosts Detail">
                          <IconButton
                            onClick={(event) =>
                              handleHostsView(event, row.name)
                            }
                          >
                            <VisibilityIcon sx={{ fontSize: 20 }} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit">
                          <IconButton
                            onClick={
                              level === 1
                                ? (event) => handleHostsEdit(event, row.name)
                                : (event) => handlePrivelege(event)
                            }
                          >
                            <EditIcon sx={{ fontSize: 20 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="delete host">
                          <IconButton
                            onClick={
                              level === 1
                                ? (event) => handleHostsDelete(event, row)
                                : (event) => handlePrivelege(event)
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows1.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Service grouped by deployemnet types dialog appears when  you are trying to delete a host that has few service running on it */}
      <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            There are few services running on this host.Upon Deletion,Data will
            be lost
          </DialogTitle>
          <DialogContent>
            <Box bgcolor={'#eeeeee'} sx={{ p: 2 }}>
              <DialogContentText>
                <Typography
                  sx={{
                    whiteSpace: 'pre-line',
                    fontFamily: 'monospace',
                    flex: 1,
                    flexWrap: 'wrap',
                  }}
                  color="red"
                >
                  {Object.entries(typeData).map(([key, value]) => (
                    <div>
                      {key}
                      {'=>'}
                      {JSON.stringify(value)}
                    </div>
                  ))}
                </Typography>
              </DialogContentText>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleMigrateOpen}>Migrate</Button>
            <Button onClick={handleClose}>Close</Button>
            <Box>
              <Button onClick={handleClose}>Delete anyway</Button>
            </Box>
          </DialogActions>
        </Dialog>
      </div>

      {/* Migrate dialog box listing services that can be migrated and those that
     cannot be appears after host to be deleted dialog box and on clicking of 
     migrate button from previus dialog */}
      <div>
        <Dialog open={migrateopen} onClose={handleMigrateClose}>
          <DialogTitle>Services that can be migrated</DialogTitle>
          <DialogContent>
            <Box bgcolor={'#eeeeee'} sx={{ p: 2 }}>
              <DialogContentText>
                <Typography
                  sx={{
                    whiteSpace: 'pre-line',
                    fontFamily: 'monospace',
                    flex: 1,
                    flexWrap: 'wrap',
                  }}
                  color="red"
                >
                  {JSON.stringify(migrateList?.p)}
                </Typography>
              </DialogContentText>
            </Box>
          </DialogContent>
          <DialogTitle>Services that cannot be migrated</DialogTitle>
          <DialogContent>
            <Box bgcolor={'#eeeeee'} sx={{ p: 2 }}>
              <DialogContentText>
                <Typography
                  sx={{
                    whiteSpace: 'pre-line',
                    fontFamily: 'monospace',
                    flex: 1,
                    flexWrap: 'wrap',
                  }}
                  color="red"
                >
                  {JSON.stringify(migrateList?.np)}
                </Typography>
              </DialogContentText>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleMigrateClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    </Box>
  );
};













































































































































































