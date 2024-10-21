 
 import {RotatingLines } from 'react-loader-spinner'
 function Spinner() {
    return (
        <RotatingLines
            visible={true}
            height="48"
            width="48"
            color="grey"
            strokeWidth="5"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
            wrapperStyle={{}}
            wrapperClass=""
        />
    )
}

export default Spinner;