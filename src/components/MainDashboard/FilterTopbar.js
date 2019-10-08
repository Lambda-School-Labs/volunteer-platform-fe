import React, { useState, useEffect } from 'react';
import { useStateValue } from '../../hooks/useStateValue';
import { Card, Form, Row, Col, Input, Icon, Divider, Select } from 'antd';
import { StyledCheckableTag as CheckableTag } from '../../styled';

const tabList = [
  {
    key: 'Events',
    tab: 'Events',
  },
  {
    key: 'Organizations',
    tab: 'Organizations',
  },
];

export const FilterTopbar = ({
  changeHandlers,
  inputState,
  tagFilterState,
  tagExpandState,
  selectedTags,
  toggleTagExpand,
  activeTab,
  setActiveTabKey,
  loading,
}) => {
  const [state, dispatch] = useStateValue();
  const [filterExpand, setFilterExpand] = useState(false);
  const {
    onChange,
    onLocationChange,
    onTagsChange,
    onSelectedChange,
  } = changeHandlers;

  const toggleFilterExpand = () => {
    setFilterExpand(!filterExpand);
  };

  const CheckableTags = ({
    tags,
    onChange,
    collectionName,
    tagFilterState,
    tagExpandState,
    toggleTagExpand,
  }) => {
    const [collapsed, setCollapsed] = useState(!tagExpandState[collectionName]);

    const collapsedCount = 14;
    const [visibleCount, setVisibleCount] = useState(collapsedCount);

    const toggle = () => {
      toggleTagExpand(collectionName);
    };

    useEffect(() => {
      if (!tagExpandState[collectionName]) {
        setVisibleCount(collapsedCount);
      } else {
        setVisibleCount(tags.length);
      }
    }, [tagExpandState]);

    let children = [];

    for (let i = 0; i < tags.length; i++) {
      children.push(
        <CheckableTag
          key={i}
          onChange={onChange}
          name={tags[i]}
          collection={collectionName}
          checked={tagFilterState[collectionName][tags[i]]}
          style={{ display: i < visibleCount ? 'inline-block' : 'none' }}
        >
          {tags[i]}
        </CheckableTag>
      );
    }

    children.push(
      <a
        key={'a link'}
        style={{ marginLeft: 8, fontSize: 12 }}
        onClick={toggle}
        style={{
          display: collapsedCount >= tags.length ? 'none' : 'inline-block',
        }}
      >
        {collapsed ? 'More' : 'Hide'} <Icon type={collapsed ? 'down' : 'up'} />
      </a>
    );

    return <Row>{children}</Row>;
  };

  const SelectableTags = ({ tags, onChange, collectionName, selectedTags }) => {
    const { Option } = Select;
    let children = [];

    const changeHandler = selected => {
      onChange(selected, collectionName);
    };

    for (let i = 0; i < tags.length; i++) {
      children.push(<Option key={tags[i]}>{tags[i]}</Option>);
    }

    return (
      <Select
        name={collectionName}
        onChange={changeHandler}
        value={selectedTags[collectionName]}
        showArrow
        mode={'multiple'}
        placeholder="Choose..."
        style={{ width: 350 }}
      >
        {children}
      </Select>
    );
  };

  const contentList = {
    Events: (
      <div>
        <Form layout="inline">
          <CheckableTags
            tags={state.tags.causeAreas}
            onChange={onTagsChange}
            collectionName="causeAreas"
            tagFilterState={tagFilterState}
            tagExpandState={tagExpandState}
            toggleTagExpand={toggleTagExpand}
          />
          <Divider dashed style={{ marginTop: 16 }} />
          <Row>
            <Row style={{ fontSize: 18 }}>Location</Row>
            <Form.Item label="City">
              <Input
                value={inputState.location.city}
                name={'city'}
                onChange={onLocationChange}
                placeholder="City"
              />
            </Form.Item>
            <Form.Item label="State">
              <Input
                value={inputState.location.state}
                name={'state'}
                onChange={onLocationChange}
                placeholder="State Initials"
              />
            </Form.Item>
          </Row>
          <Divider dashed style={{ marginBottom: 8 }} />
          <Row>
            <a
              style={{ marginLeft: 8, fontSize: 12 }}
              onClick={toggleFilterExpand}
            >
              {filterExpand ? 'Hide Filters' : 'More Filters'}{' '}
              <Icon type={filterExpand ? 'up' : 'down'} />
            </a>
          </Row>
        </Form>
        <Form
          layout="inline"
          style={{ display: filterExpand ? 'block' : 'none' }}
        >
          <Row>
            <Col span={12}>
              <Form.Item label="Interests">
                <SelectableTags
                  tags={state.tags.interests}
                  onChange={onSelectedChange}
                  collectionName="interests"
                  selectedTags={selectedTags}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Requirements">
                <SelectableTags
                  tags={state.tags.requirements}
                  onChange={onSelectedChange}
                  collectionName="requirements"
                  selectedTags={selectedTags}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    ),
    Organizations: (
      <Form layout="inline">
        <CheckableTags
          tags={state.tags.causeAreas}
          onChange={onTagsChange}
          collectionName="causeAreas"
          tagFilterState={tagFilterState}
          tagExpandState={tagExpandState}
          toggleTagExpand={toggleTagExpand}
        />
        <Divider dashed style={{ marginTop: 16 }} />
        <Row>
          <Row style={{ fontSize: 18 }}>Location</Row>
          <Form.Item label="City">
            <Input
              value={inputState.location.city}
              name={'city'}
              onChange={onLocationChange}
              placeholder="City"
            />
          </Form.Item>
          <Form.Item label="State">
            <Input
              value={inputState.location.state}
              name={'state'}
              onChange={onLocationChange}
              placeholder="State Initials"
            />
          </Form.Item>
        </Row>
      </Form>
    ),
  };

  const onTabChange = key => {
    if (!loading) setActiveTabKey(key);
  };

  return (
    <Card
      bordered={false}
      tabList={tabList}
      activeTabKey={activeTab}
      onTabChange={key => onTabChange(key)}
      loading={loading}
    >
      {contentList[activeTab]}
    </Card>
  );
};
