import React, { useEffect } from 'react';
import './App.css';
import TestPage from './pages/TestPage/TestPage';
import UtilScreen from './utils/comUtil/UtilScreen';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ThreeJsDemo from './pages/ThreeJsDemo/ThreeJsDemo';


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

  return (
    <BrowserRouter>
      <Switch>
        <Route path={"/test"} exact={true} component={TestPage} />
        <Route path={"/threejsdemo"} exact={true} component={ThreeJsDemo} />
      </Switch>
    </BrowserRouter>


  );
}

export default App;
