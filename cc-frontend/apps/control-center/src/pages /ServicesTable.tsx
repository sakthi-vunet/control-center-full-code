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
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import url_backend from '../configs/url';

export interface ServiceData {
  _id: string;
  name: string;
  type: string;
  state: string;
  description: string;
  expected_instances: number;
  actual_instances: number;
  hosts: string[];
  labels: string[];
}

const actionService =async (data) =>{
    
  const request_url=url_backend+'/api/services/';
  
  try {

      const response = await axios({
      method: "put",
      url: request_url,
      data: JSON.stringify(data),
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log(response);
  
  } catch(error) {
  
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
  id: keyof ServiceData;
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
    id: 'type',
    numeric: false,
    disablePadding: false,
    label: 'Type',
  },
  {
    id: 'actual_instances',
    numeric: true,
    disablePadding: false,
    label: 'Instances',
  },
  {
    id: 'expected_instances',
    numeric: true,
    disablePadding: false,
    label: 'Nodes',
  },
  {
    id: 'hosts',
    numeric: false,
    disablePadding: false,
    label: 'Node List',
  },
];

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
    (property: keyof ServiceData) => (event: React.MouseEvent<unknown>) => {
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
              'aria-label': 'select all services',
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

// const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
//   const { numSelected } = props;
  

//   return (
//     <Toolbar
//       sx={{
//         pl: { sm: 2 },
//         pr: { xs: 1, sm: 1 },
//         ...(numSelected > 0 && {
//           bgcolor: (theme) =>
//             alpha(
//               theme.palette.primary.main,
//               theme.palette.action.activatedOpacity
//             ),
//         }),
//       }}
//     >
//       {numSelected > 0 ? (
//         <Typography
//           sx={{ flex: '1 1 100%' }}
//           color="inherit"
//           variant="subtitle1"
//           component="div"
//         >
//           {numSelected} selected
//         </Typography>
//       ) : (
//         <Typography
//           sx={{ flex: '1 1 100%' }}
//           variant="h6"
//           id="tableTitle"
//           component="div"
//         >
//           Services
//         </Typography>
//       )}
//       {numSelected > 0 ? (
//         <>
//           <Tooltip title="Start Service">
//             <IconButton>
//               <PlayCircleOutlineRoundedIcon />
//             </IconButton>
//           </Tooltip>
//           <Tooltip title="Stop Service">
//             <IconButton>
//               <PauseCircleOutlineRoundedIcon />
//             </IconButton>
//           </Tooltip>
//           <Tooltip title="Delete">
//             <IconButton>
//               <DeleteIcon />
//             </IconButton>
//           </Tooltip>
//         </>
//       ) : (
//         <Tooltip title="Expanded view">
//           <IconButton onClick={routeChangeContainer}>
//             <AssignmentRoundedIcon />
//           </IconButton>
//         </Tooltip>
//       )}
//     </Toolbar>
//   );
// };


export const ServicesTableActions: React.FC<{ data: ServiceData[] }> = ({
  data,
}) => {
  const navigate = useNavigate();
  
  const routeChangeView = (name: string) => {
    const path = `/app/controlcenter/ServicesInfo`;
    navigate(path, { state: { id: name } });
  };
  
  const routeChangeEdit = (name: string) => {
    const path = `/app/controlcenter/EditServices`;
    navigate(path, { state: { id: name } });
  };

  const routeChangeContainer = () => {
    const path = `/app/controlcenter/Containers`;
    navigate(path);
  };

  const [orderBy, setOrderBy] = React.useState<keyof ServiceData>('name');
  const [order, setOrder] = React.useState<Order>('asc');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searched, setSearched] = React.useState<string>('');
  const [numSelected,setNums]= React.useState(0);

  const [rows1, setRows1] = React.useState<ServiceData[]>(data);


  React.useEffect(() => {
    setRows1(data);
    setNums(selected.length);
  }, [data,selected.length]);

 

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
    property: keyof ServiceData
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

  const handleServicesView = (
    event: React.MouseEvent<unknown>,
    name: string
  ) => {
    console.log(name);
    event.preventDefault();
    event.stopPropagation();
    routeChangeView(name);
  };

  const handleServicesEdit = (
    event: React.MouseEvent<unknown>,
    name: string
  ) => {
    console.log(name);
    event.preventDefault();
    event.stopPropagation();
    routeChangeEdit(name);
  };

  const startService=()=>{
    console.log(selected);
    let temp={}
    selected.forEach(function (item, index) {
      temp={
        "name":item,
        "action":"start"
      };
      actionService(temp);
    });
  }

  const stopService=()=>{
    console.log(selected);
    let temp={}
    selected.forEach(function (item, index) {
      temp={
        "name":item,
        "action":"stop"
      };
      actionService(temp);
    });
  }
  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }} elevation={3}>
        {/* <EnhancedTableToolbar numSelected={selected.length} /> */}

        {/* <Paper sx={{ width: '20%', textAlign: 'center' }}>
          
        </Paper>
        <span style={{ marginLeft: '.5rem' }} /> */}
        <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        })
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
          <Tooltip title="Delete">
            <IconButton>
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
          <IconButton onClick={routeChangeContainer}>
            <AssignmentRoundedIcon />
          </IconButton>
        </Tooltip>
        </>

      )}
       {/* <SearchBar
            value={searched}
            onChange={(searchVal) => requestSearch(searchVal)}
            onCancelSearch={() => cancelSearch()}
          /> */}
    </Toolbar>
    {/* <SearchBar
            value={searched}
            onChange={(searchVal) => requestSearch(searchVal)}
            onCancelSearch={() => cancelSearch()}
          /> */}
    <Paper sx={{ width:'20%',textAlign:'center'}}>
        

     
        </Paper>
        <TableContainer>
          <Table
            sx={{ minWidth: 70 }}
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
                      sx={{ padding: 'checkbox' }}
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
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        align="left"
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="left" >{row.type}</TableCell>
                      <TableCell align="left">
                        {JSON.stringify(row.actual_instances) +
                          '/' +
                          JSON.stringify(row.expected_instances)}
                      </TableCell>
                      <TableCell align="left">{row.hosts.length}</TableCell>
                      <TableCell align="left">
                        {JSON.stringify(row.hosts, null, 2)}
                      </TableCell>
                      <TableCell align="left">
                        <Tooltip title="Services Detail">
                          <IconButton
                            onClick={(event) =>
                              handleServicesView(event, row._id)
                            }
                          >
                            <VisibilityIcon sx={{ fontSize: 20 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={(event) =>
                              handleServicesEdit(event, row._id)
                            }
                          >
                            <EditIcon sx={{ fontSize: 20 }} />
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
    </Box>
  );
};
