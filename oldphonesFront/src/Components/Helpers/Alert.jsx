import React from 'react';
import capitalize from './Capitalize';
function Alert(props) {
  return (
    <div style = {{height: '50px', position : "fixed", zIndex : "1", width : "100%"}}>
      {props.alert && (
        <div className = {`alert alert-${props.alert.type} alert-dismissible fade show`} role="alert">
          <strong> {capitalize(props.alert.type)} </strong> : {props.alert.msg}
        </div>
      )}
    </div>
  );
}

export default Alert;
