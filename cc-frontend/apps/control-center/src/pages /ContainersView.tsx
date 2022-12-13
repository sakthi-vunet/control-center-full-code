import * as React from 'react';

import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import ClearIcon from '@mui/icons-material/Clear';
import DoneAll from '@mui/icons-material/DoneAll';
import { IconButton } from '@mui/material';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { ContainerData } from '../models/ContainerData';

// style for accordion head
const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

// style for accordion summary
const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

// style for accordion details
const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export const ContainersView: React.FC<{ data: ContainerData[] }> = ({
  data,
}) => {
  // handles container expansion
  const [expanded, setExpanded] = React.useState<string | false>('panel1');

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <>
      {data.map((row, index) => {
        return (
          <div>
            <Typography
              sx={{ flex: '1 1 100%' }}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              {/* container name */}
              Container {'>>'} {row.name}
              {/* running icon will be green and not running icon will be red */}
              <IconButton sx={{ color: row.host ? '#6fbf73' : '#f6685e' }}>
                {row.host ? <DoneAll /> : <ClearIcon />}
              </IconButton>
            </Typography>

            <span style={{ marginLeft: '.5rem' }} />
            {/* Basic Information Accordion */}
            <Accordion
              expanded={expanded === 'panel1'}
              onChange={handleChange('panel1')}
            >
              <AccordionSummary
                aria-controls="panel1d-content"
                id="panel1d-header"
              >
                <Typography>Basic Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Container ID {'>>'} {row._id}
                </Typography>
              </AccordionDetails>
            </Accordion>
            {/* Service name */}
            <Accordion
              expanded={expanded === 'panel2'}
              onChange={handleChange('panel2')}
            >
              <AccordionSummary
                aria-controls="panel2d-content"
                id="panel2d-header"
              >
                <Typography>Name Of Service</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{row.service}</Typography>
              </AccordionDetails>
            </Accordion>
            {/* Host the container is running on */}
            <Accordion
              expanded={expanded === 'panel3'}
              onChange={handleChange('panel3')}
            >
              <AccordionSummary
                aria-controls="panel3d-content"
                id="panel3d-header"
              >
                <Typography>Node</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{row.host}</Typography>
              </AccordionDetails>
            </Accordion>
            {/* Start time of container */}
            <Accordion
              expanded={expanded === 'panel4'}
              onChange={handleChange('panel4')}
            >
              <AccordionSummary
                aria-controls="panel4d-content"
                id="panel4d-header"
              >
                <Typography>Start time</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{row.started_at}</Typography>
              </AccordionDetails>
            </Accordion>
            {/* Service Deployment type */}
            <Accordion
              expanded={expanded === 'panel5'}
              onChange={handleChange('panel5')}
            >
              <AccordionSummary
                aria-controls="panel5d-content"
                id="panel5d-header"
              >
                <Typography>Type of Service</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{row.type}</Typography>
              </AccordionDetails>
            </Accordion>
          </div>
        );
      })}
    </>
  );
};
