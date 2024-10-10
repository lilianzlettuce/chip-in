import { useRouteError } from "react-router-dom";
import Layout from "./Layout";

export default function ErrorPage() {
  const error:any = useRouteError() as String;
  console.error(error);

  return (
    <Layout>
      <div>
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p> <br/>
        <p>This page is just like your dad,</p>
        <p>
          <i>{error.code} {error.statusText || error.message}</i>
        </p>
      </div>
    </Layout>
  );
}