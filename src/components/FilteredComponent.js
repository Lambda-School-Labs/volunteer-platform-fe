import React from 'react';

export const FilteredComponent = Component => {
  return ({ events, filter, tagFilter, recurringEvents }, ...props) => {
    const { location } = filter;
    const { interests, requirements, causeAreas } = tagFilter;
    const { state, city } = location;

    let filterCount = 0;
    for(let key in interests)
        interests[key] && filterCount++
    for(let key in requirements)
        requirements[key] && filterCount++
    for(let key in causeAreas)
        causeAreas[key] && filterCount++
    if (!events || !filterCount) {
      return (
        <Component
          events={events}
          recurringEvents={recurringEvents}
          {...props}
        />
      );
    }

    let filteredEvents = [...events, ...recurringEvents];
    filteredEvents.forEach(event => (event.sortRank = 0));

    /* This is a crude way to sort events. For each filter match, sortRank
     * is incremented. At the end, we sort the results by sortRank. Any
     * events with a sortRank of zero are removed.
     *
     * I'm sure a more elegant, modularized solution is possible.
     */

    if (state) {
      filteredEvents.forEach(event => {
        if (event.state.toLowerCase().includes(state.toLowerCase())) {
          event.sortRank = event.sortRank + 1;
        }
      });
    }
    if (city) {
      filteredEvents.forEach(event => {
        if (event.city.toLowerCase().includes(city.toLowerCase())) {
          event.sortRank = event.sortRank + 1;
        }
      });
    }
    if (interests) {
      filteredEvents.forEach(event => {
        event.interest.forEach(interest => {
          if (tagFilter.interests[interest])
            event.sortRank = event.sortRank + 1;
        });
      });
    }
    if (requirements) {
      filteredEvents.forEach(event => {
        event.volunteerRequirements.forEach(requirement => {
          if (tagFilter.requirements[requirement])
            event.sortRank = event.sortRank + 1;
        });
      });
    }

    filteredEvents.sort((a, b) => (a.sortRank < b.sortRank ? 1 : -1));
    filteredEvents = filteredEvents.filter(event => event.sortRank > 0);

    return (
      <Component
        filtered={true}
        events={filteredEvents}
        recurringEvents={[]}
        {...props}
      />
    );
  };
};
