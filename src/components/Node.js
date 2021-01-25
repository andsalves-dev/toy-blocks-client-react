import React from "react";
import PropTypes from "prop-types";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails,
  makeStyles,
  Box,
} from "@material-ui/core";
import colors from "../constants/colors";
import Status from "./Status";

const Node = ({ node, expanded, toggleNodeExpanded }) => {
  const classes = useStyles();
  const renderBlocks = () => {
    if (node.error) {
      return (
        <Typography className={classes.errorMessage}>
          Error while retrieving blocks
        </Typography>
      );
    }

    if (!node.blocks || node.blocks.length === 0) {
      return (
        <Typography className={classes.noBlocks}>
          No blocks
        </Typography>
      );
    }

    return (
      <ul className={classes.blockList}>
        {node.blocks && node.blocks.map((block, key) => (
          <li key={`${block.id}-${key}`} className={classes.blockItem} data-qa="blockItem">
            <span>{String(block.id).padStart(3, '0')}</span>
            <p>{block.text}</p>
          </li>
        ))}
      </ul>
    )
  };

  return (
    <ExpansionPanel
      elevation={3}
      className={classes.root}
      expanded={expanded}
      onChange={() => toggleNodeExpanded(node)}
    >
      <ExpansionPanelSummary
        className={classes.summary}
        classes={{
          expandIcon: classes.icon,
          content: classes.content,
          expanded: classes.expanded,
        }}
        expandIcon={<ExpandMoreIcon />}
      >
        <Box className={classes.summaryContent}>
          <Box>
            <Typography variant="h5" className={classes.heading}>
              {node.name || "Unknown"}
            </Typography>
            <Typography
              variant="subtitle1"
              className={classes.secondaryHeading}
            >
              {node.url}
            </Typography>
          </Box>
          <Status loading={node.loading} online={node.online} />
        </Box>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        {renderBlocks()}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "16px 0",
    boxShadow: "0px 3px 6px 1px rgba(0,0,0,0.15)",
    "&:before": {
      backgroundColor: "unset",
    },
  },
  summary: {
    padding: "0 24px",
  },
  summaryContent: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingRight: 20,
  },
  icon: {
    color: colors.faded,
  },
  content: {
    margin: "10px 0 !important", // Avoid change of sizing on expanded
  },
  expanded: {
    "& $icon": {
      paddingLeft: 0,
      paddingRight: 12,
      top: -10,
      marginRight: 0,
    },
  },
  heading: {
    fontSize: theme.typography.pxToRem(17),
    display: "block",
    color: colors.text,
    lineHeight: 1.5,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(14),
    color: colors.faded,
    lineHeight: 2,
  },

  blockList: {
    listStyle: 'none',
    padding: '0',
    width: '100%',
  },

  blockItem: {
    padding: '4px 8px',
    background: 'rgba(0, 0, 0, 0.12)',
    marginBottom: '4px',
    borderRadius: '2px',

    "& p": {
      margin: '0',
      color: '#263238',
      fontWeight: '400',
      fontSize: '14px',
    },

    "& span": {
      letterSpacing: '1px',
      color: '#304FFE',
      fontWeight: '700',
      fontSize: '10px',
    }
  },

  noBlocks: {
    fontSize: '12px',
    color: '#777',
  },

  errorMessage: {
    fontSize: '14px',
    color: 'red',
  }
}));

Node.propTypes = {
  node: PropTypes.shape({
    url: PropTypes.string,
    online: PropTypes.bool,
    name: PropTypes.string,
    loading: PropTypes.bool,
    blocks: PropTypes.array,
  }).isRequired,
  expanded: PropTypes.bool,
  toggleNodeExpanded: PropTypes.func.isRequired,
};

export default Node;
