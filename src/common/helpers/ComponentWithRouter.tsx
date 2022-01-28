import {
  NavigateFunction,
  Params,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

//TODO fix any
export interface IRouter {
  location: Location;
  navigate: NavigateFunction;
  params: Readonly<Params<string>>;
}

function withRouter(Component: React.ElementType) {
  function ComponentWithRouterProp(props: any) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    return <Component {...props} router={{ location, navigate, params }} />;
  }

  return ComponentWithRouterProp;
}

export default withRouter;
