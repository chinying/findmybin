const sidebarStyle = {
  position: 'absolute',
  width: '20%',
  height: '100vh',
  maxHeight: '100vh',
  overflow: 'scroll',
  background: 'white',
  zIndex: 99999
}

const bodyStyle = {
  margin: 0,
  padding: 0
}

const floatStyle = {
  position: 'absolute'
}

const flexStyle = {
  display: 'flex',
  // flexDirection: 'column',
  // justifyContent: 'flexEnd',
  zIndex: 999999
}

const searchBoxStyle = {
  ...floatStyle,
  zIndex: 99999,
  top: 0,
  left: 'calc(50% - 50px)'
};

const materialBoxStyle = {
  ...floatStyle,
  zIndex: 99999,
}

export { bodyStyle, sidebarStyle, flexStyle, materialBoxStyle, searchBoxStyle }