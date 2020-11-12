import React, { useEffect, useReducer } from 'react';
import './App.css';
import TestPage from './pages/TestPage/TestPage';
import UtilScreen from './utils/comUtil/UtilScreen';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import ThreeJsDemo from './pages/ThreeJsDemo/ThreeJsDemo';
import GIS from './pages/GIS/GIS';
import Overview from './pages/GIS/components/Overview/Overview';
import StartGIS from './pages/GIS/components/StartGIS/StartGIS';
import { StoreInterface } from './store/appStore/storeInterface';
import { appReducer, defaultState } from './store/appStore/storeReducer';
import OpenLayerDemo from './pages/OpenLayer/OpenLayer';
import GetStart from './pages/CesiumDemo/GetStart/GetStart';
import ChBuild from './pages/CesiumDemo/ChBuild/ChBuild';
import LoadModel from './pages/CesiumDemo/LoadModel/LoadModel';

export const TContext = React.createContext<StoreInterface | any>(defaultState);

function App() {

  // 粉刷匠 仅执行一次
  useEffect(() => {
    setHtmlFootSize();
    window.onresize = setHtmlFootSize;
  }, [])

  // 粉刷匠 设置字体
  const setHtmlFootSize = () => {
    // 获取Doc的文字的大小
    let docEl = document.documentElement as any;
    let fontSize = UtilScreen.getDocElFontSize();
    fontSize && (docEl.style.fontSize = fontSize + "px");
  }

  const [state, dispatch] = useReducer(appReducer, defaultState);

  return (

    <TContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Switch>
          <Route path={"/test"} exact={true} component={TestPage} />
          <Route path={"/threejsdemo"} exact={true} component={ThreeJsDemo} />
          <Route path={"/openlayer"} exact={true} component={OpenLayerDemo} />
          <Route path={"/getstart"} exact={true} component={GetStart} />
          <Route path={"/chbuild"} exact={true} component={ChBuild} />
          <Route path={"/loadModel"} exact={true} component={LoadModel} />

          <GIS>
            <Route path={"/"} exact={true} component={Overview} />
            <Route path={"/overview"} exact={true} component={Overview} />
            <Route path={"/startgis"} exact={true} component={StartGIS} />
          </GIS>
          <Redirect from="/" to={"/gis"} />

        </Switch>
      </BrowserRouter>


    </TContext.Provider>

  );
}

export default App;
