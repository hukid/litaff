import React, { PropTypes } from 'react';
import BigCalendar from 'react-big-calendar';
import { withStyles } from 'material-ui/styles';
import { Link } from 'react-router';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';

import ToolBar from './toolbar';

const allViews = Object.keys(BigCalendar.Views).map((k) => BigCalendar.Views[k]);

// const styles = (theme) => ({
//   eventContainer: {
//     position: 'relative',
//   },
//   iconContainer: {
//     // position: 'absolute',
//     // left: 0,
//     // right: 0,
//     // bottom: 0,
//     display: 'flex',
//     'justify-content': 'flex-end',
//   },
//   iconButton: {
//     height: 'auto',
//     width: 'auto',
//   },
// });

function CustomEventView(props) {
  const { event, classes } = props;
  return (
    <div className={classes.eventContainer} x>
      <div>
        {event.title}
      </div>
      {/* <div className={classes.iconContainer}>
        <IconButton className={classes.iconButton} component={Link} >
          <EditIcon />
        </IconButton>
        <IconButton className={classes.iconButton} aria-label="Delete" >
          <DeleteIcon />
        </IconButton>
      </div> */}
    </div>
  );
}

// const StyledEventView = withStyles(styles)(CustomEventView);

// function EventWrapperView(props) {
//   const { children, classes } = props;
//   return (
//     <div>
//       <div style={{ position: 'relative' }} >
//         <div className={classes.iconContainer}>
//           <IconButton className={classes.iconButton} component={Link} >
//             <EditIcon />
//           </IconButton>
//           <IconButton className={classes.iconButton} aria-label="Delete" >
//             <DeleteIcon />
//           </IconButton>
//         </div>
//         { children }
//       </div>
//     </div>
//   );
// }

// const StyledEventWrapperView = withStyles(styles)(EventWrapperView);

const components = {
  // event: StyledEventView, // used by each view (Month, Day, Week)
  toolbar: ToolBar,
  // //eventWrapper: StyledEventWrapperView,
  // week: {
  //   event: StyledEventView,
  // },
};

function CalendarView(props) {
  const { events, onSelectEvent, onSelectSlot, onView, onNavigate, view, date, selected } = props;
  return (
    <BigCalendar
      selectable
      selected={selected}
      view={view}
      date={date}
      components={components}
      onSelectEvent={onSelectEvent}
      onSelectSlot={onSelectSlot}
      onView={onView}
      onNavigate={onNavigate}
      events={events}
      views={['month', 'week', 'agenda']}
      scrollToTime={new Date(1970, 1, 1, 6)}
      defaultDate={new Date()}
    >
    </BigCalendar>
  );
}

CalendarView.propTypes = {
  events: PropTypes.array,
  onSelectEvent: PropTypes.func.isRequired,
};

export default CalendarView;
