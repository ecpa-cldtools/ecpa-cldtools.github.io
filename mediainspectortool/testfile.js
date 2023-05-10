function appMain() {
  const objMiTool = new ClsMediaInspectorTool();

  const getResourcesPerfData = () => {
    console.log("This is good for now....");
  };

  getResourcesPerfData();
}

/** ************************* */
/** Main() */
/** ************************* */

$(window).load(function () {
  // start javascript
  appMain();
});
