import {TextField as MuiTextField} from '@mui/material';

const InputBase = ({label, value, readOnly=false, ...params}) => {
    return (
        <MuiTextField
            label={label}
            variant="standard"
            value={value}
            rows={5}
            InputLabelProps={{ shrink: true, style: { fontSize: 20, padding:'8px' } }}
            sx={{ width: 300,
                    background:'#fafafa',
                    padding:'8px',

                    '& .MuiInput-underline:before': {
                      borderBottom: 'none',
                    },
                    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                      borderBottom: 'none',
                    },
                    '& .MuiInput-underline:after': {
                      borderBottom: 'none',
                    },
                  
             }}
            InputProps={{
                readOnly,
              }}
              {...params}
          />
    )
}

export default InputBase;