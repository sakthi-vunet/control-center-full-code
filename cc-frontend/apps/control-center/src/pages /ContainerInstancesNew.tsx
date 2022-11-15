import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import PauseCircleOutlineRoundedIcon from '@mui/icons-material/PauseCircleOutlineRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SearchBar from 'material-ui-search-bar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import LoginSharpIcon from '@mui/icons-material/LoginSharp';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { common, green } from '@mui/material/colors';
import { ThemeProvider } from '@material-ui/core';
import { createTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';

export interface ContainerData {
  _id: string;
  name: string;
  started_at: string;
  host: string;
  service: string;
  type: string;
}

const theme = createTheme({
  overrides: {
    MuiTableCell: {
      root: {
        //This can be referred from Material UI API documentation.
        padding: '4px 8px',
        backgroundColor: '#fff',
      },
    },
  },
});

const useStyles = makeStyles({
  tableRow: {
    height: 30,
  },
  tableCell: {
    padding: '0px 16px',
  },
});

const actionContainer = async (data) => {
  const request_url = '/api/containers/';
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

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof ContainerData;
  label: string;
  numeric: boolean;
}

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
    label: 'Node',
  },
];

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

interface EnhancedTableToolbarProps {
  numSelected: number;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { numSelected } = props;
  const navigate = useNavigate();

  const routeChange = () => {
    const path = `/app/controlcenter/Services`;
    navigate(path);
  };

  return (
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
          <Tooltip title="Start Service">
            <IconButton>
              <PlayCircleOutlineRoundedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Stop Service">
            <IconButton>
              <PauseCircleOutlineRoundedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <>
          <Tooltip title="Expanded view">
            <IconButton onClick={routeChange}>
              <AssignmentRoundedIcon />
            </IconButton>
          </Tooltip>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
        </>
      )}
    </Toolbar>
  );
};

export const ContainerTable: React.FC<{ data: ContainerData[] }> = ({
  data,
}) => {
  const navigate = useNavigate();

  const routeChange = () => {
    const path = `/app/controlcenter/Services`;
    navigate(path);
  };

  const [open, setOpen] = React.useState(false);
  const [logdata, setLogdata] = React.useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [orderBy, setOrderBy] = React.useState<keyof ContainerData>('name');
  const [order, setOrder] = React.useState<Order>('asc');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(8);
  const [searched, setSearched] = React.useState<string>('');
  const [numSelected, setNums] = React.useState(0);
  const [currLogs, setCurrLogs] = React.useState('');

  const [rows1, setRows1] = React.useState<ContainerData[]>(data);

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const timer = React.useRef<number>();

  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      '&:hover': {
        bgcolor: green[700],
      },
    }),
  };

  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const handleButtonClick = () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      timer.current = window.setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 2000);
    }
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

  const getLogs = async (id) => {
    let url = '/api/logs/?_id=';
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

  const requestSearch = (searchedVal: string) => {
    const filteredRows = data.filter((row) => {
      return row.name.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setRows1(filteredRows);
  };

  const cancelSearch = () => {
    setSearched('');
    requestSearch(searched);
  };
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof ContainerData
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows1.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const routeChangeView = (name: string) => {
    const path = `/app/controlcenter/ContainersInfo`;
    navigate(path, { state: { id: name } });
  };

  const handleContainerView = (
    event: React.MouseEvent<unknown>,
    name: string
  ) => {
    console.log(name);
    event.preventDefault();
    event.stopPropagation();
    routeChangeView(name);
  };

  const handleRefresh = () => {
    // window. location. reload();
    getLogs(currLogs).then((res) => {
      setLogdata(res);
    });
  };

  const handleContainerLogin = (
    event: React.MouseEvent<unknown>,
    name: string
  ) => {
    console.log(name);
    event.preventDefault();
    event.stopPropagation();
  };

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

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
  const classes = useStyles();

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        {/* <EnhancedTableToolbar numSelected={selected.length} />
        <Paper sx={{ width:'20%',textAlign:'center'}}> */}
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
              {/* <SearchBar
        value={searched}
        onChange={(searchVal) => requestSearch(searchVal)}
        onCancelSearch={() => cancelSearch()}
        
        /> */}
              <Tooltip title="Expanded view">
                <IconButton onClick={routeChange}>
                  <AssignmentRoundedIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Toolbar>

        {/* <ThemeProvider theme={theme}> */}
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
                      className={classes.tableRow}
                    >
                      <TableCell
                        padding="checkbox"
                        className={classes.tableCell}
                      >
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        align="left"
                        className={classes.tableCell}
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="left" className={classes.tableCell}>
                        {row.host}
                      </TableCell>
                      <TableCell align="left" className={classes.tableCell}>
                        <Tooltip title="View">
                          <IconButton
                            onClick={(event) =>
                              handleContainerView(event, row._id)
                            }
                          >
                            <VisibilityIcon sx={{ fontSize: 20 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Login">
                          <IconButton
                            onClick={(event) =>
                              handleContainerLogin(event, row._id)
                            }
                          >
                            <LoginSharpIcon sx={{ fontSize: 20 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Check Logs">
                          <IconButton
                            onClick={(event) =>
                              handleContainerLogs(event, row.name)
                            }
                          >
                            <InsertDriveFileIcon sx={{ fontSize: 20 }} />
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
        {/* </ThemeProvider> */}
        <TablePagination
          rowsPerPageOptions={[8, 16, 24]}
          component="div"
          count={rows1.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Container Log</DialogTitle>
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
                  {logdata}
                </Typography>
              </DialogContentText>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
            <Box>
              <Button onClick={handleButtonClick}>Refresh</Button>
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
    </Box>
  );
};
