import React, { useState } from 'react';
import {
  Modal,
  Select,
  Checkbox,
  Radio,
  DatePicker,
  InputNumber,
  Form,
} from 'antd';

import moment from 'moment';
import styled from 'styled-components';

const { Option } = Select;

export const RecurringEvent = props => {
  const { localState, setLocalState, error, setError } = props;
  const { dynamicDates, recurringInfo } = localState;

  const { dynamicNumber, dynamicNth, dynamicDay, dynamicYear } = dynamicDates;
  const [formState, setFormState] = useState({});

  const dayOptions = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const timePeriodOptions = ['Day', 'Week', 'Month'];

  const monthlyOptions = [
    `Monthly on day ${dynamicNumber}`,
    `Monthly on ${dynamicNth} ${dynamicDay}`,
  ];

  const repeatTimePeriodOptions = [
    'Weekdays',
    'Weekends (Fri, Sat, Sun)',
    'Sat/Sun Only',
    `Weekly on ${dynamicDay}`,
  ];

  if (dynamicNth !== 'Fifth') {
    repeatTimePeriodOptions.push(`Monthly on ${dynamicNth} ${dynamicDay} `);
  }

  repeatTimePeriodOptions.push(`Annually on ${dynamicYear}`);
  repeatTimePeriodOptions.push('Other');

  const closeModal = () => {
    setFormState({
      ...formState,
      recurringBoolean: false,
    });
  };

  const handleChange = (name, value) => {
    if (value === 'Other') {
      setFormState({
        ...formState,
        recurringBoolean: true,
      });
    }
    setLocalState({
      ...localState,
      recurringInfo: {
        ...recurringInfo,
        [name]: value,
      },
    });
  };

  const cancelModal = () => {
    setLocalState({
      ...localState,
      recurringInfo: {
        ...recurringInfo,
        repeatEvery: '',
        repeatEveryValue: '',
        days: '',
        monthlyPeriod: '',
      },
    });
    closeModal();
  };

  const isModalValid = () => {
    if (
      recurringInfo.repeatEveryValue === 'Day' ||
      recurringInfo.repeatEveryValue === 'Days'
    ) {
      return true;
    } else if (
      recurringInfo.repeatEveryValue === 'Week' ||
      (recurringInfo.repeatEveryValue === 'Weeks'
        ? recurringInfo.days.length > 0
        : null)
    ) {
      return true;
    } else if (
      recurringInfo.repeatEveryValue === 'Month' ||
      (recurringInfo.repeatEveryValue === 'Months'
        ? recurringInfo.monthlyPeriod
        : null)
    ) {
      return true;
    }
  };

  const checkedRequired = () => {
    if (
      recurringInfo.repeatTimePeriod === 'Other' &&
      recurringInfo.repeatEvery > 0
    ) {
      if (isModalValid()) {
        closeModal();
        setError('');
      } else {
        setError('This field is required.');
      }
    }
  };

  const periodOfTimeMap = timePeriodOptions.map(period => {
    if (localState.recurringInfo.repeatEvery > 1) {
      return (
        <Option key={period} value={period + 's'}>
          {period + 's'}
        </Option>
      );
    } else {
      return (
        <Option key={period} value={period}>
          {period}
        </Option>
      );
    }
  });

  const repeatTimePeriodMap = repeatTimePeriodOptions.map(period => {
    return (
      <Option key={period} value={period}>
        {period}
      </Option>
    );
  });

  const monthlyPeriodMap = monthlyOptions.map(period => {
    return (
      <Option key={period} value={period}>
        {period}
      </Option>
    );
  });

  return (
    <StyledDiv>
      <Form>
        <Form.Item>
          <Radio.Group
            name={'recurringEvent'}
            onChange={e => handleChange(e.target.name, e.target.value)}
            disabled={!dynamicDay}
            defaultValue={recurringInfo.recurringEvent === 'Yes' ? 'Yes' : 'No'}
          >
            <Radio value={'Yes'}>Yes</Radio>
            <Radio value={'No'}>No</Radio>
          </Radio.Group>
        </Form.Item>

        {recurringInfo.recurringEvent === 'Yes' && (
          <span>
            <span>
              <Form.Item label={'Repeat Every'} required>
                <div className={'input'}>
                  <Select
                    name={'repeatTimePeriod'}
                    defaultValue={recurringInfo.repeatTimePeriod}
                    onChange={value => handleChange('repeatTimePeriod', value)}
                  >
                    {repeatTimePeriodMap}
                  </Select>
                </div>
                {error && !recurringInfo.repeatTimePeriod && (
                  <span className="error-message error-span left-aligned">
                    {error}
                  </span>
                )}
              </Form.Item>
            </span>
            <div>
              <Form.Item label={'Event Ends'} required>
                <Radio.Group
                  name={'Occurrence Ends'}
                  defaultValue={
                    recurringInfo.occurrenceEnds === 'On'
                      ? 'On'
                      : recurringInfo.occurrenceEnds === 'After'
                      ? 'After'
                      : 'Never'
                  }
                  onChange={e => handleChange('occurrenceEnds', e.target.value)}
                  className={'radioWrapper'}
                >
                  <Radio value={'On'}>On</Radio>
                  <Radio value={'After'}>After</Radio>
                  <Radio value={'Never'}>Never</Radio>
                </Radio.Group>
                {error && !recurringInfo.occurrenceEnds && (
                  <span className="error-message error-span left-aligned">
                    {error}
                  </span>
                )}
              </Form.Item>
            </div>
            {recurringInfo.occurrenceEnds === 'On' && (
              <Form.Item>
                <DatePicker
                  name={'occurrenceEndDate'}
                  format={'MM/DD/YYYY'}
                  onChange={value => handleChange('occurrenceEndDate', value)}
                  value={recurringInfo.occurrenceEndDate}
                  disabledDate={current =>
                    current && current < moment().endOf('day')
                  }
                />
              </Form.Item>
            )}

            {recurringInfo.occurrenceEnds === 'After' && (
              <Form.Item>
                <InputNumber
                  name={'occurrenceEndsAfter'}
                  min={0}
                  defaultValue={recurringInfo.occurrenceEndsAfter || 1}
                  onChange={value => handleChange('occurrenceEndsAfter', value)}
                />{' '}
                Occurrence
              </Form.Item>
            )}
          </span>
        )}
      </Form>

      <Modal
        title="Add a Custom Repeat Time Period"
        width={720}
        closable
        onOk={() => checkedRequired()}
        onCancel={() => cancelModal()}
        onClose={closeModal}
        visible={formState.recurringBoolean}
      >
        <Form>
          <div>
            <div className={''}>
              <Form.Item label={'Repeat Every'}>
                <InputNumber
                  name={'repeatEvery'}
                  style={{ margin: 'o auto' }}
                  defaultValue={recurringInfo.repeatEvery}
                  onChange={value => handleChange('repeatEvery', value)}
                  min={0}
                />
                {error && !recurringInfo.repeatEvery && (
                  <span className="error-message error-span left-aligned">
                    {error}
                  </span>
                )}
              </Form.Item>
            </div>
            <div>
              <Form.Item>
                <Select
                  name={'repeatEveryValue'}
                  value={recurringInfo.repeatEveryValue}
                  onChange={value => handleChange('repeatEveryValue', value)}
                >
                  {periodOfTimeMap}
                </Select>
                {error && !recurringInfo.repeatEveryValue && (
                  <span className="error-message error-span left-aligned">
                    {error}
                  </span>
                )}
              </Form.Item>
            </div>

            {recurringInfo.repeatEveryValue === 'Week' ||
            recurringInfo.repeatEveryValue === 'Weeks' ? (
              <Form.Item label={'On'}>
                <div className={'errorFlex'}>
                  <div>
                    <Checkbox.Group
                      name={'Days'}
                      defaultValue={recurringInfo.days}
                      options={dayOptions}
                      onChange={value => handleChange('days', value)}
                    />
                  </div>
                  <div>
                    {error && !recurringInfo.days.length > 0 && (
                      <span
                        className="error-message error-span left-aligned"
                        style={{ color: 'red', frontSize: '12px' }}
                      >
                        {error}
                      </span>
                    )}
                  </div>
                </div>
              </Form.Item>
            ) : null}

            {recurringInfo.repeatEveryValue === 'Month' ||
            recurringInfo.repeatEveryValue === 'Months' ? (
              <div>
                <Form.Item>
                  <Select
                    name={'Monthly Period'}
                    defaultValue={recurringInfo.monthlyPeriod}
                    onChange={value => handleChange('monthlyPeriod', value)}
                  >
                    {monthlyPeriodMap}
                  </Select>
                  {error && !recurringInfo.monthlyPeriod && (
                    <span
                      className="error-message error-span left-aligned"
                      style={{ color: 'red', frontSize: '12px' }}
                    >
                      {error}
                    </span>
                  )}
                </Form.Item>
              </div>
            ) : null}
          </div>
        </Form>
      </Modal>
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  .input {
    width: 80%;
  }
  .errorFlex {
    display: flex;
    flex-direction: column;
  }
`;

export default RecurringEvent;
