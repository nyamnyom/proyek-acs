import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Box, Container, Tab, Tabs, Typography
} from "@mui/material";
import HistoryOrder from "./history_order";
import HistoryPengiriman from "./history_pengiriman";
import HistoryNota from "./history_nota";


function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function HistoryPage({ defaultTab = 0, setSelectedTab }) {
  const [value, setValue] = useState(defaultTab);

  useEffect(() => {
    setValue(defaultTab);
  }, [defaultTab]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSelectedTab(newValue);
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 2 }}>History</Typography>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="History Order" {...a11yProps(0)} />
            <Tab label="History Pengiriman" {...a11yProps(1)} />
            <Tab label="History Nota" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <HistoryOrder />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <HistoryPengiriman />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <HistoryNota />
        </CustomTabPanel>
      </Box>
    </Container>
  );
}

HistoryPage.propTypes = {
  defaultTab: PropTypes.number,
  setSelectedTab: PropTypes.func
};