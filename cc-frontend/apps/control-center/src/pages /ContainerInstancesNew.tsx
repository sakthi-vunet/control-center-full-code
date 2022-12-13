import * as React from 'react';
import { ThreeDots } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';

import SearchBar from '@mkyy/mui-search-bar';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import LoginSharpIcon from '@mui/icons-material/LoginSharp';
import PauseCircleOutlineRoundedIcon from '@mui/icons-material/PauseCircleOutlineRounded';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
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
import { green } from '@mui/material/colors';
import { alpha } from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/material/styles';
import { styled } from '@mui/styles';
import { visuallyHidden } from '@mui/utils';
import axios from 'axios';

import url_backend from '../configs/url';
import { ContainerData } from '../models/ContainerData';

// put request to start or stop container
const actionContainer = async (data) => {
  const request_url = url_backend + '/api/containers/';
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

//  comparator for table column
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

function getComparator<Key extends keyof ContainerData>(
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

// props for headcell of table
interface HeadCell {
  disablePadding: boolean;
  id: keyof ContainerData;
  label: string;
  numeric: boolean;
}

// table head column names
const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Name',
  },
  {
    id: 'host',
    numeric: false,
    disablePadding: false,
    label: 'Status',
  },
  {
    id: 'host',
    numeric: false,
    disablePadding: false,
    label: 'Node',
  },
];

// table props
interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof ContainerData
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

// table head component
function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;

  // handles sort
  const createSortHandler =
    (property: keyof ContainerData) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all containers',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
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
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
  );
}

// props for row selection number
interface EnhancedTableToolbarProps {
  numSelected: number;
}

// style for table cells with no padding
const StyledTableCell = styled(TableCell)({
  padding: 0,
});

export const ContainerTable: React.FC<{ data: ContainerData[] }> = ({
  data,
}) => {
  const navigate = useNavigate();

  // route to service page
  const routeChange = () => {
    const path = `/app/controlcenter/Services`;
    navigate(path);
  };

  // logs dialog box open variables
  const [open, setOpen] = React.useState(false);
  const [logdata, setLogdata] = React.useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setLogdata('');
  };

  // table feature parameters
  const [orderBy, setOrderBy] = React.useState<keyof ContainerData>('name');
  const [order, setOrder] = React.useState<Order>('asc');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searched, setSearched] = React.useState<string>('');
  const [numSelected, setNums] = React.useState(0);

  // set log data
  const [currLogs, setCurrLogs] = React.useState('');

  // set selected or searched rows
  const [rows1, setRows1] = React.useState<ContainerData[]>(data);

  // refresh for logs
  const [loading, setLoading] = React.useState(false);
  const timer = React.useRef<number>();

  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  // handles log data refresh
  const handleRefresh = () => {
    setLogdata('');
    getLogs(currLogs).then((res) => {
      setLogdata(res);
    });
  };

  React.useEffect(() => {
    setRows1(data);
  }, [data]);

  React.useEffect(() => {
    setNums(selected.length);
  }, [selected.length]);

  // gets logs from backend
  const getLogs = async (id) => {
    let url = url_backend + '/api/logs/?_id=';
    url = url + id;
    console.log(url);
    try {
      const data = await axios.get<string>(url);

      return JSON.parse(JSON.stringify(data.data));
    } catch (e) {
      console.log(e);
      return 'cannot connect to container';
    }
  };

  // handles web terminal login to the container
  const getLogin = async (id) => {
    let url = url_backend + '/api/login/?name=';
    url = url + id;
    console.log(url);
    try {
      const data = await axios.get<string>(url);
      console.log('Login' + JSON.stringify(data.data));

      if (data.data === '')
        alert('Login to container not possible as container is not running');
      else
        try {
          window.open(data.data, '_blank')?.focus();
        } catch (e) {
          alert('Web tty container daemon failed. Login unavailable');
        }

      return JSON.parse(JSON.stringify(data.data));
    } catch (e) {
      console.log(e);
      console.log('Login cannot connect to container');
      return 'cannot connect to container';
    }
  };

  // handles search
  const requestSearch = (searchedVal: string) => {
    const filteredRows = data.filter((row) => {
      return (
        row.name.toLowerCase().includes(searchedVal.toLowerCase()) ||
        row.host.toLowerCase().includes(searchedVal.toLowerCase())
      );
    });
    setRows1(filteredRows);
  };

  // handles sort
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof ContainerData
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // handles all row selection in table
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows1.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  // handles single row selection in table
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

  //  handles change in table page
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  //  handles multirows
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // route to container view page
  const routeChangeView = (name: string) => {
    const path = `/app/controlcenter/ContainersInfo`;
    navigate(path, { state: { id: name } });
  };

  // handles redirection to container view
  const handleContainerView = (
    event: React.MouseEvent<unknown>,
    name: string
  ) => {
    console.log(name);
    event.preventDefault();
    event.stopPropagation();
    routeChangeView(name);
  };

  // check if the container is runnning or not
  const checkRunning = (node: string) => {
    // containers that are stopped will not have a node
    if (node === '') return false;
    else return true;
  };

  // handles redirect to web terminal login of container
  const handleContainerLogin = (
    event: React.MouseEvent<unknown>,
    name: string
  ) => {
    getLogin(name);
    event.preventDefault();
    event.stopPropagation();
  };

  //  handles logs of container
  const handleContainerLogs = (
    event: React.MouseEvent<unknown>,
    name: string
  ) => {
    console.log(name);
    setCurrLogs(name);
    event.preventDefault();
    event.stopPropagation();
    handleClickOpen();
    getLogs(name).then((res) => {
      setLogdata(res);
    });
  };

  // starts container
  const startContainer = () => {
    console.log(selected);
    let temp = {};
    selected.forEach(function (item, index) {
      temp = {
        name: item,
        action: 'start',
      };
      actionContainer(temp);
    });
  };

  // stops container
  const stopContainer = () => {
    console.log(selected);
    let temp = {};
    selected.forEach(function (item, index) {
      temp = {
        name: item,
        action: 'stop',
      };
      actionContainer(temp);
    });
  };

  // delete container
  const deleteContainer = () => {
    console.log(selected);
    let temp = {};
    selected.forEach(function (item, index) {
      temp = {
        name: item,
        action: 'remove',
      };
      actionContainer(temp);
    });
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  //  container logs dialog component
  const LogsDialog = () => {
    return (
      <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Container Log</DialogTitle>
          <DialogContent>
            <Box bgcolor={'#eeeeee'} sx={{ p: 2 }}>
              <DialogContentText>
                {/* <LoadingIndicatorLogs/> */}
                <Typography
                  sx={{
                    whiteSpace: 'pre-line',
                    fontFamily: 'monospace',
                    flex: 1,
                    flexWrap: 'wrap',
                    wordWrap: 'break-word',
                    fontSize: '15px',
                  }}
                  color="red"
                >
                  {logdata ? (
                    logdata
                  ) : (
                    <ThreeDots color={'red'} height={80} width={80} />
                  )}
                </Typography>
              </DialogContentText>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
            <Box>
              <Button onClick={handleRefresh}>Refresh</Button>
              {loading && (
                <CircularProgress
                  size={24}
                  sx={{
                    color: green[500],
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
              )}
            </Box>
          </DialogActions>
        </Dialog>
      </div>
    );
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
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
              id="tableTitlParameter 'singleOption' implicitly has an 'any' typee"
              component="div"
            >
              Container Instances
            </Typography>
          )}
          {numSelected > 0 ? (
            <>
              <Tooltip title="Start Container">
                <IconButton onClick={startContainer}>
                  <PlayCircleOutlineRoundedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Stop Container" onClick={stopContainer}>
                <IconButton>
                  <PauseCircleOutlineRoundedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton onClick={deleteContainer}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <>
              <SearchBar
                value={searched}
                onChange={(searchVal) => requestSearch(searchVal)}
              />
              {/* service npage redirection button */}
              <Tooltip title="Expanded view">
                <IconButton onClick={routeChange}>
                  <AssignmentRoundedIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Toolbar>
        {/* logs dialog appears when log view button is clicked */}
        <LogsDialog />
        <StyledEngineProvider injectFirst>
          <TableContainer>
            <Table
              sx={{ minWidth: 70 }}
              aria-labelledby="tableTitle"
              size="small"
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
                    const colorRunning = checkRunning(row.host);

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
                          padding: 'checkbox',
                          // backgroundColor: (colorRunning?'#6fbf73':'#f6685e')
                        }}
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
                        {/* container name */}
                        <StyledTableCell
                          id={labelId}
                          scope="row"
                          padding="none"
                          align="left"
                        >
                          {row.name}
                        </StyledTableCell>
                        {/* container status */}
                        <StyledTableCell
                          align="left"
                          sx={{ color: colorRunning ? '#6fbf73' : '#f6685e' }}
                        >
                          {colorRunning ? 'Running' : 'Not Running'}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.host}
                        </StyledTableCell>

                        <StyledTableCell align="left">
                          <Tooltip title="View">
                            {/* container view page */}
                            <IconButton
                              onClick={(event) =>
                                handleContainerView(event, row._id)
                              }
                            >
                              <VisibilityIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Login">
                            {/* container login button  */}
                            {/* opens web terminal with bash of container */}
                            <IconButton
                              onClick={(event) =>
                                handleContainerLogin(event, row.name)
                              }
                            >
                              <LoginSharpIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Check Logs">
                            {/* opens the log dialog for the container */}
                            <IconButton
                              onClick={(event) =>
                                handleContainerLogs(event, row.name)
                              }
                            >
                              <InsertDriveFileIcon sx={{ fontSize: 20 }} />
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
        </StyledEngineProvider>
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
