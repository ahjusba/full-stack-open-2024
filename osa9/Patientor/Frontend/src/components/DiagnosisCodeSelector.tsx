import { FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent } from "@mui/material";
import { codes } from "../constants";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

type Props = {
  onChange: (event: SelectChangeEvent<typeof codes>) => void;
  diagnosisCodes: string[];
};

const DiagnosisCodeSelector = ({ onChange, diagnosisCodes }: Props) => {

  return (
    <FormControl sx={{ m: 1, width: 300 }}>
      <InputLabel id="demo-multiple-name-label">Diagnoses</InputLabel>
      <Select
        labelId="demo-multiple-name-label"
        id="demo-multiple-name"
        multiple
        value={diagnosisCodes}
        onChange={onChange}
        input={<OutlinedInput label="Diagnoses" />}
        MenuProps={MenuProps}
      >
        {codes.map((code: string) => (
          <MenuItem
            key={code}
            value={code}
          >
            {code}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DiagnosisCodeSelector;