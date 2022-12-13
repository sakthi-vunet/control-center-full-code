import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import SearchBar from '@mkyy/mui-search-bar';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PauseCircleOutlineRoundedIcon from '@mui/icons-material/PauseCircleOutlineRounded';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
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
import { styled } from '@mui/styles';
import { visuallyHidden } from '@mui/utils';
import axios from 'axios';

import url_backend from '../configs/url';
import { AuthContext } from '../context/AuthContext';
import { ServiceData } from '../models/ServiceData';

// function that starts/stops service by put request to api/services
const actionService = async (data) => {
  const request_url = url_backend + '/api/services/';

  try {
    const response = await axios({
      method: 'put',
      url: request_url,
      data: JSON.stringify(data),
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

// sorting function for table column
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

// comparator function for table column
function getComparator<Key extends keyof ServiceData>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string | string[] },
  b: { [key in Key]: number | string | string[] }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// table headcell interface
interface HeadCell {
  disablePadding: boolean;
  id: keyof ServiceData;
  label: string;
  numeric: boolean;
}

// headcells data for service table
const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Name',
  },
  {
    id: 'type',
    numeric: false,
    disablePadding: false,
    label: 'Type',
  },
  {
    id: 'expected_instances',
    numeric: true,
    disablePadding: false,
    label: 'Instances',
  },
  {
    id: 'hosts',
    numeric: false,
    disablePadding: false,
    label: 'Node List',
  },
  {
    id: 'actual_instances',
    numeric: true,
    disablePadding: false,
    label: 'Nodes',
  },

  {
    id: 'actual_instances',
    numeric: true,
    disablePadding: false,
    label: 'Status',
  },
];

// props for table
interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof ServiceData
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

//  table head function
function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;

  // function to handle sort on click
  const createSortHandler =
    (property: keyof ServiceData) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {/* Checkbox for multiple row selection */}
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all services',
            }}
          />
        </TableCell>

        {/* Table columns */}
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'center' : 'left'}
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
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}

        {/* Actions column for edit view icons*/}
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
  );
}

export const ServicesTableActions: React.FC<{ data: ServiceData[] }> = ({
  data,
}) => {
  const navigate = useNavigate();

  // handles route change to service view
  const routeChangeView = (name: string) => {
    const path = `/app/controlcenter/ServicesInfo`;
    navigate(path, { state: { id: name } });
  };

  // handles route change to edit service
  const routeChangeEdit = (name: string) => {
    const path = `/app/controlcenter/EditServices`;
    navigate(path, { state: { id: name } });
  };

  // handles rout change to container page
  const routeChangeContainer = () => {
    const path = `/app/controlcenter/Containers`;
    navigate(path);
  };

  // data table parameters
  const [orderBy, setOrderBy] = React.useState<keyof ServiceData>('name');
  const [order, setOrder] = React.useState<Order>('asc');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searched, setSearched] = React.useState<string>('');
  const [numSelected, setNums] = React.useState(0);

  // rows variable fo search
  const [rows1, setRows1] = React.useState<ServiceData[]>(data);

  // user variable to set privelege level
  const { user } = React.useContext(AuthContext);
  const [level, setLevel] = React.useState(() =>
    user['username'] === 'admin' ? 1 : 0
  );

  // function that handles privelege
  const handlePrivelege = (event: React.MouseEvent<unknown>) => {
    event.preventDefault();
    event.stopPropagation();
    alert('Operation not permitted.');
  };

  // style table cell to have less padding
  const StyledTableCell = styled(TableCell)({
    padding: 0,
    align: 'left',
  });

  // set rows for searched value and selected rows number value
  React.useEffect(() => {
    setRows1(data);
    setNums(selected.length);
  }, [data, selected.length]);

  // function that handles search based on name column and type column
  const requestSearch = (searchedVal: string) => {
    const filteredRows = data.filter((row) => {
      return (
        row.name.toLowerCase().includes(searchedVal.toLowerCase()) ||
        row.type.toLowerCase().includes(searchedVal.toLowerCase())
      );
    });
    setRows1(filteredRows);
  };

  // calls the sort function descending or ascending
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof ServiceData
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // function that handles select all rows feature
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows1.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  // function to handle single row select
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

  // change page in table
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // change pagination(rows per page)
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // service view handler
  const handleServicesView = (
    event: React.MouseEvent<unknown>,
    name: string
  ) => {
    console.log(name);
    event.preventDefault();
    event.stopPropagation();
    routeChangeView(name);
  };

  // service edit handler
  const handleServicesEdit = (
    event: React.MouseEvent<unknown>,
    name: string
  ) => {
    console.log(name);
    event.preventDefault();
    event.stopPropagation();
    routeChangeEdit(name);
  };

  // start service handler
  const startService = () => {
    console.log(selected);
    let temp = {};
    selected.forEach(function (item, index) {
      temp = {
        name: item,
        action: 'start',
      };
      actionService(temp);
    });
  };
  // stop service handler
  const stopService = () => {
    console.log(selected);
    let temp = {};
    selected.forEach(function (item, index) {
      temp = {
        name: item,
        action: 'stop',
      };
      actionService(temp);
    });
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  // checks if the actual number of running instances exceed the expected instance value
  const checkRunning = (expected: number, actual: number) => {
    if (actual < expected) return false;
    else return true;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }} elevation={3}>
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
              Services
            </Typography>
          )}
          {/* Start and Stop service buttons */}
          {numSelected > 0 ? (
            <>
              <Tooltip title="Start Service">
                <IconButton onClick={startService}>
                  <PlayCircleOutlineRoundedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Stop Service">
                <IconButton onClick={stopService}>
                  <PauseCircleOutlineRoundedIcon />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            // Search bar
            <>
              <SearchBar
                value={searched}
                onChange={(searchVal) => requestSearch(searchVal)}
              />

              {/* Container Page Button */}
              <Tooltip title="Expanded view">
                <IconButton onClick={routeChangeContainer}>
                  <AssignmentRoundedIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Toolbar>

        <Paper sx={{ width: '20%', textAlign: 'center' }}></Paper>
        <TableContainer>
          <Table
            sx={{ minWidth: 70 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            {/* Table head */}
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
                  const colorRunning = checkRunning(
                    row.expected_instances,
                    row.actual_instances
                  );

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                      sx={{ padding: 'checkbox' }}
                    >
                      <StyledTableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </StyledTableCell>
                      <StyledTableCell id={labelId} scope="row">
                        {row.name}
                      </StyledTableCell>
                      <StyledTableCell>{row.type}</StyledTableCell>
                      <StyledTableCell
                        sx={{ textJustify: 'inter-word', textAlign: 'center' }}
                      >
                        {JSON.stringify(row.actual_instances) +
                          '/' +
                          JSON.stringify(row.expected_instances)}
                      </StyledTableCell>
                      <StyledTableCell>
                        {JSON.stringify(row.hosts, null, 2)}
                      </StyledTableCell>
                      <StyledTableCell
                        sx={{ textJustify: 'inter-word', textAlign: 'center' }}
                      >
                        {row.hosts.length}
                      </StyledTableCell>
                      {/* Status is green or red based on actual instance value */}
                      <StyledTableCell
                        sx={{ textJustify: 'inter-word', textAlign: 'center' }}
                      >
                        {colorRunning ? (
                          <IconButton sx={{ color: 'green' }}>
                            <CheckCircleIcon />
                          </IconButton>
                        ) : (
                          <IconButton sx={{ color: 'red' }}>
                            <CancelIcon />
                          </IconButton>
                        )}
                      </StyledTableCell>
                      <StyledTableCell>
                        <Tooltip title="Services Detail">
                          <IconButton
                            onClick={(event) =>
                              handleServicesView(event, row._id)
                            }
                          >
                            <VisibilityIcon sx={{ fontSize: 20 }} />
                          </IconButton>
                        </Tooltip>
                        {/* Edit option available only based on privelege */}
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={
                              level === 1
                                ? (event) => handleServicesEdit(event, row._id)
                                : (event) => handlePrivelege(event)
                            }
                          >
                            <EditIcon sx={{ fontSize: 20 }} />
                          </IconButton>
                        </Tooltip>
                      </StyledTableCell>
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
          rowsPerPageOptions={[10, 20, 30]}
          component="div"
          count={rows1.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};
