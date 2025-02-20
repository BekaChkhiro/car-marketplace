import { Switch, FormControlLabel } from '@mui/material';
import { styled } from '@mui/material/styles';

interface CurrencySelectorProps {
  currentCurrency: string;
  setCurrentCurrency: (currency: string) => void;
}

const CustomSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 0,
  position: 'relative',
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(28px)',
      color: '#fff',
      '& .MuiSwitch-thumb:before': {
        content: '"$"',
      },
      '& + .MuiSwitch-track:before': {
        color: '#fff',
      },
      '& + .MuiSwitch-track:after': {
        color: '#000',
      },
    },
    '& .MuiSwitch-thumb:before': {
      content: '"₾"',
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 14,
      fontWeight: 500,
      color: '#4CAF50',
    },
    '&:not(.Mui-checked) + .MuiSwitch-track:before': {
      color: '#000',
    },
    '&:not(.Mui-checked) + .MuiSwitch-track:after': {
      color: '#fff',
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 30,
    height: 30,
    position: 'relative',
    backgroundColor: '#fff',
  },
  '& .MuiSwitch-track': {
    borderRadius: 34 / 2,
    backgroundColor: '#4CAF50 !important',
    opacity: '1 !important',
    transition: theme.transitions.create(['background-color', 'color'], {
      duration: 500,
    }),
    '&:before, &:after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: 14,
      fontWeight: 500,
      transition: theme.transitions.create(['color'], {
        duration: 300,
      }),
    },
    '&:before': {
      content: '"₾"',
      left: 8,
    },
    '&:after': {
      content: '"$"',
      right: 8,
    },
  },
}));

const CurrencySelector = ({ currentCurrency, setCurrentCurrency }: CurrencySelectorProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentCurrency(event.target.checked ? 'USD' : 'GEL');
  };

  return (
    <FormControlLabel
      control={
        <CustomSwitch
          checked={currentCurrency === 'USD'}
          onChange={handleChange}
        />
      }
      label=""
    />
  );
};

export default CurrencySelector;