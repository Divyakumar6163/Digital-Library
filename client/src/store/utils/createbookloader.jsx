import { FallingLines } from 'react-loader-spinner';

export function Createbookloader({Heading}) {
    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            {/* Book Creation Text */}
            <h1 className='text-3xl font-semibold text-gray-800 mb-4'>
                {Heading}
            </h1>
            <div className='flex items-center justify-center'>
                <FallingLines
                    color="#4fa94d"
                    width="120"
                    height="120px"
                    visible={true}
                    ariaLabel="falling-circles-loading"
                />
            </div>

            {/* Optional Description */}
            <p className='mt-4 text-lg text-gray-600'>
                Please wait while we process your request.
            </p>
        </div>
    );
}
