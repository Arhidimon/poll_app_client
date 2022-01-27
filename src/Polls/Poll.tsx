import React from 'react';
import {
  Routes,
  Route,
  useParams,
  Navigate,
  Link as RouterLink,
} from 'react-router-dom';
import withRouter, { IRouter } from '../common/helpers/ComponentWithRouter';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import {
  Breadcrumbs,
  Paper,
  Typography,
  Link,
  Divider,
  Box,
  CircularProgress,
} from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { AuthContext } from '../common/AuthContext';

interface IProps {
  router: IRouter;
}

interface IState {
  isLoaded: boolean;
  poll?: IPoll;
  error?: string;
  tabIndex: number;
}

interface IPoll {
  name: string;
  options: {
    name: string;
    numberOfVotes: number;
  }[];
  selected?: number | null;
}

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const data = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

class Poll extends React.Component<IProps, IState> {
  id = '';
  hasIncorrectId = false;
  static contextType = AuthContext;

  constructor(props: IProps) {
    super(props);

    this.state = { tabIndex: 0, isLoaded: false };

    console.log('props');
    console.log(props);
    if (props.router.params.id) {
      this.id = props.router.params.id;
    } else {
      this.hasIncorrectId = true;
    }
  }

  vote = async (optionIndex: number) => {
    console.log('vote');
    console.log(`context ${this.context} ${JSON.stringify(this.context)}`);
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    const user = localStorage.getItem('user');
    if (this.context.user && user) {
      const token = JSON.parse(user).access_token;
      headers.Authorization = `Bearer ${token}`;
    } else {
      return;
    }
    const response = await fetch(
      `http://localhost:3000/api/polls/${this.id}/vote`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          option: optionIndex,
        }),
      },
    );
    if (response.ok) {
      const json = await response.json();
      this.setState({
        isLoaded: true,
        poll: json,
      });
    } else {
      this.setState({
        isLoaded: true,
        error: `HTTP error: ${response.status}`,
      });
    }
  };

  async componentDidMount() {
    const headers: HeadersInit = {};
    const user = localStorage.getItem('user');
    console.log(`context.user ${this.context.user} user ${user}`);
    if (this.context.user && user) {
      const token = JSON.parse(user).access_token;
      headers.Authorization = `Bearer ${token}`;
    }
    console.log(`headers ${JSON.stringify(headers)}`);
    const response = await fetch(`http://localhost:3000/api/polls/${this.id}`, {
      method: 'GET',
      headers,
    });
    if (response.ok) {
      const json = await response.json();
      this.setState({
        isLoaded: true,
        poll: json,
      });
    } else {
      this.setState({
        isLoaded: true,
        error: `HTTP error: ${response.status}`,
      });
    }
  }

  convertDataToDoughnutChart(data: IPoll) {
    const chartData: ChartData<'doughnut', number[], string> = {
      labels: [],
      datasets: [
        {
          label: '# of Votes',
          data: [],
          borderWidth: 2,
        },
      ],
    };
    const backgroundColor = [];
    const borderColor = [];

    for (let i = 0; i < data.options.length; i++) {
      const colorString = `rgba(${Math.floor(
        Math.random() * 255,
      )}, ${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255,
      )}, `;
      backgroundColor.push(colorString + '0.2');
      borderColor.push(colorString + '1');
    }
    chartData.datasets[0].backgroundColor = backgroundColor;
    chartData.datasets[0].borderColor = borderColor;

    for (const option of data.options) {
      chartData.labels?.push(option.name);
      chartData.datasets[0].data.push(option.numberOfVotes);
    }

    return chartData;
  }

  convertDataToBarChart(data: IPoll) {
    const chartData: ChartData<'bar', number[], string> = {
      labels: [],
      datasets: [
        {
          label: '# of Votes',
          data: [],
          borderWidth: 2,
        },
      ],
    };
    const backgroundColor = [];
    const borderColor = [];

    for (let i = 0; i < data.options.length; i++) {
      const colorString = `rgba(${Math.floor(
        Math.random() * 255,
      )}, ${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255,
      )}, `;
      backgroundColor.push(colorString + '0.2');
      borderColor.push(colorString + '1');
    }
    chartData.datasets[0].backgroundColor = backgroundColor;
    chartData.datasets[0].borderColor = borderColor;

    for (const option of data.options) {
      chartData.labels?.push(option.name);
      chartData.datasets[0].data.push(option.numberOfVotes);
    }

    return chartData;
  }

  changeOption = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('changeOption');
    if (this.context.user) {
      this.vote(parseInt(event.target.value));
      this.setState((previousState) => {
        if (previousState.poll) {
          return {
            poll: {
              ...previousState.poll,
              selected: parseInt(event.target.value),
            },
          };
        } else {
          return {};
        }
      });
    }
  };

  render() {
    if (this.hasIncorrectId) {
      // this.props.router.navigate('/404', { replace: true });
      return <Navigate to="/404" />;
    }

    const handleTabChange = (
      event: React.SyntheticEvent,
      newTabIndex: number,
    ) => {
      this.setState({
        tabIndex: newTabIndex,
      });
    };
    if (this.state.poll) {
      console.log(`this.state.poll.selected ${this.state.poll.selected}`);
    }

    return (
      <>
        <main>
          <div className="Poll">
            {this.state.isLoaded && this.state.poll ? (
              <>
                <h1>{this.state.poll.name}</h1>
                <Paper elevation={3}>
                  <Breadcrumbs aria-label="breadcrumb">
                    <Link
                      underline="hover"
                      color="inherit"
                      to="/polls"
                      component={RouterLink}
                    >
                      Polls
                    </Link>
                    {/* <Link to="/polls">Polls</Link> */}
                    <Typography color="text.primary">
                      {this.state.poll.name}
                    </Typography>
                  </Breadcrumbs>
                  <Divider variant="middle" />
                  {this.context.user && (
                    <FormControl component="fieldset">
                      <FormLabel component="legend">
                        {this.state.poll.name}
                      </FormLabel>
                      <Box
                        sx={{
                          bgcolor: 'background.paper',
                          color: 'text.primary',
                          left: '0',
                        }}
                      >
                        <RadioGroup
                          aria-label="poll"
                          name="radio-buttons-group"
                          value={
                            this.state.poll.selected === null ||
                            this.state.poll.selected === undefined
                              ? undefined
                              : this.state.poll.selected.toString()
                          }
                          onChange={this.changeOption}
                        >
                          {Object.values(this.state.poll.options).map(
                            (currentValue, index) => (
                              <FormControlLabel
                                value={index}
                                control={<Radio />}
                                label={currentValue.name}
                              />
                            ),
                          )}
                        </RadioGroup>
                      </Box>
                    </FormControl>
                  )}
                  <Tabs
                    value={this.state.tabIndex}
                    onChange={handleTabChange}
                    centered
                  >
                    <Tab label="Doughnut Chart" />
                    <Tab label="Bar Chart" />
                  </Tabs>
                  {this.state.tabIndex === 0 && (
                    <Doughnut
                      data={this.convertDataToDoughnutChart(this.state.poll)}
                    />
                  )}
                  {this.state.tabIndex === 1 && (
                    <Bar data={this.convertDataToBarChart(this.state.poll)} />
                  )}
                </Paper>
              </>
            ) : (
              <CircularProgress />
            )}
          </div>
        </main>
      </>
    );
  }
}

export default withRouter(Poll);
