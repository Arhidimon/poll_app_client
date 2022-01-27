/* eslint-disable prettier/prettier */
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import LinkIcon from '@mui/icons-material/Link';
import { Button, Paper } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRowId,
  GridRowsProp,
} from '@mui/x-data-grid';
import { withSnackbar } from 'notistack';
import React from 'react';
import { Link } from 'react-router-dom';
import withRouter, { IRouter } from '../common/helpers/ComponentWithRouter';
import AddIcon from '@mui/icons-material/Add';
import { AuthContext } from '../common/AuthContext';

// interface IProps {}
interface IState {
  error?: any;
  isLoaded: boolean;
  polls: {
    name: string;
    options: string[];
  }[];
}

const rows: GridRowsProp = [
  { id: 2, name: 'Hello', votes: 123 },
  { id: 7, name: 'Helloa', votes: 22 },
  { id: 8, name: 'DataGridPro', votes: 3 },
  { id: 9, name: 'MUI', votes: 42 },
];

class Polls extends React.Component<any, IState> {
  //
  onCopyUrlClick = (id: GridRowId) => {
    return () => {
      navigator.clipboard.writeText(window.location + '/' + id);
      this.props.enqueueSnackbar('Poll link copied to buffer.', {
        variant: 'success',
      });
    };
  };

  dataGridColumns: GridColDef[] = [
    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      renderCell: (params) => {
        console.log();
        return (
          <>
            <Button style={{ minWidth: '0' }}>
              <Link
                to={'/polls/' + params.id}
                style={{ textDecoration: 'none' }}
              >
                <HowToVoteIcon />
              </Link>
            </Button>
            <Button
              onClick={this.onCopyUrlClick(params.id)}
              style={{ minWidth: '0' }}
            >
              <LinkIcon />
            </Button>
          </>
        );
      },
    },
    { field: 'name', headerName: 'Caption', minWidth: 200, flex: 1 },
    { field: 'votes', headerName: 'Users voted', width: 150 },
    { field: 'poll_type', headerName: 'Type', width: 100 },
    { field: 'start', headerName: 'Start date', width: 100, hide: true },
    { field: 'end', headerName: 'End date', width: 100, hide: true },
  ];

  router: IRouter;

  constructor(props: { router: IRouter }) {
    super(props);

    this.router = this.props.router;
    this.state = {
      error: null,
      isLoaded: false,
      polls: [],
    };
  }

  static contextType = AuthContext;

  async componentDidMount() {
    const response = await fetch('http://localhost:3000/api/polls');
    if (response.ok) {
      const json = await response.json();
      this.setState({
        isLoaded: true,
        polls: json,
      });
    } else {
      this.setState({
        isLoaded: true,
        error: response.status,
      });
    }
  }

  onCellClick() {
    console.log('clicked');
    return;
  }

  render() {
    return (
      <main>
        <div className="Polls">
          <Paper elevation={3}>
            <h1>Polls:</h1>
          </Paper>
          {this.context.user && (
            <Link to={'/polls/new'} style={{ textDecoration: 'none' }}>
              <Button variant="outlined" startIcon={<AddIcon />}>
                New
              </Button>
            </Link>
          )}
          <Paper elevation={3}>
            <DataGrid
              loading={!this.state.isLoaded}
              rows={this.state.polls}
              columns={this.dataGridColumns}
              autoHeight
              disableSelectionOnClick
              onCellClick={this.onCellClick}
            />
          </Paper>
        </div>
      </main>
    );
  }
}

export default withSnackbar(withRouter(Polls));
