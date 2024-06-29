import {TextField as MuiTextField} from '@mui/material';

const TextField = ({label, value, readOnly=false, ...params}) => {
    return (
        <MuiTextField
            label={label}
            variant="outlined"
            value={value}
            InputLabelProps={{ shrink: true }}
            sx={{ width: 300 }}
            InputProps={{
                readOnly,
              }}
              {...params}
          />
    )
}

export default TextField;