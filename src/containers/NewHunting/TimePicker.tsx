import {hours} from '@utils/time';
import {add, eachDayOfInterval, format, isBefore} from 'date-fns';
import {findIndex} from 'lodash';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import styled from 'styled-components';
import ListPicker from '../../components/ListPicker';
import {theme} from '../../theme';

interface TimePickerInterface {
  onChange?: (data: {day: string; time: string}) => void;
  style?: any;
  height?: number;
  defaultDay: string;
  defaultTime: string;
  initialDate: {day: string; time: string};
}

const TimePicker = ({
  onChange,
  style,
  height = 500,
  defaultDay,
  defaultTime,
  initialDate,
}: TimePickerInterface) => {
  const [date, setDate] = useState(defaultDay);
  const [time, setTime] = useState(defaultTime);

  const monthLaterDate = add(new Date(), {days: defaultDay ? 60 : 30});

  const dates = eachDayOfInterval({
    start: new Date(),
    end: monthLaterDate,
  });

  const daysList = dates.map(day => {
    const formatted = format(day, 'yyyy-MM-dd');
    return {label: formatted, value: formatted};
  });

  const indexOfCurrentHour = findIndex(
    hours,
    (hour: {label: string; value: string}) => hour.value === initialDate.time,
  );

  const today = isBefore(new Date(date), new Date());

  const availableHours = today ? hours.slice(indexOfCurrentHour) : hours;

  useEffect(() => {
    if (defaultDay) {
      setDate(defaultDay);
    }
    defaultTime && setTime(defaultTime);
  }, [defaultDay, defaultTime]);

  useEffect(() => {
    onChange && onChange({day: date, time});
  }, [date, time]);

  return (
    <Container style={style}>
      <Column>
        <ListPicker
          data={daysList}
          defaultValue={date}
          key={`list_picker_dates`}
          onChange={setDate}
          theme={theme}
          height={height}
          style={undefined}
        />
      </Column>
      <Column>
        <ListPicker
          data={availableHours}
          defaultValue={time}
          key={`list_picker_timer`}
          onChange={setTime}
          theme={theme}
          height={height}
          style={undefined}
        />
      </Column>
    </Container>
  );
};

const Container = styled(View)`
  display: flex;
  background-color: white;
  height: auto;
  flex-direction: row;
  flex: 1;
`;

const Column = styled(View)`
  width: 50%;
`;

export default TimePicker;
