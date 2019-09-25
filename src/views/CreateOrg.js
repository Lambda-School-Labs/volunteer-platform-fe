import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {
  WrappedAntForm, AntInput, AntSelect, AntTextArea, AntTimePicker,
  StyledCard, StyledButton,
} from '../styled';
import {useStateValue} from '../hooks/useStateValue';
import {Icon, Select} from 'antd';
import CheckboxGroup from 'antd/lib/checkbox/Group';
import {registerOrganization, updateOrganization} from '../actions';
import createOrgImg from '../assets/undraw_unexpected_friends.svg';

export const CreateOrg = props => {
  const [numberOfPOC, setNumberOfPOC] = useState(1);
  const [state, dispatch] = useStateValue();
  const [orgToEdit, setOrgToEdit] = useState({});
  const Option = Select.Option;
  
  useEffect(() => {
    if (props.location.state){
      setOrgToEdit(props.location.state.org);
      if (props.location.state.org.firstName2){
        setNumberOfPOC(2);
      }
    }
  }, []);
  
  const getPOCInputs = () => {
    const poc = [
      <div className={'flex'} key={'poc1'}>
        <div className={'inline'}><AntInput name={'First Name'}
                                            layout={formItemLayoutInline}
                                            key={'firstName'}/></div>
        
        <div className={'inline'}><AntInput name={'Last name'}
                                            layout={formItemLayoutInline}
                                            key={'lastName'}/></div>
        <div className={'inline'}><AntInput name={'Email'} type={'email'}
                                            layout={formItemLayoutInline}
                                            key={'email'}/></div>
      </div>,
    ];
    if (numberOfPOC > 1){
      poc.push(<div className={'flex'} key={'poc2'}><StyledLine
        key={Math.random()}/>
        <div className={'inline'}>
          <AntInput
            name={'First Name 2'}
            label={'First Name'}
            notRequired={'false'}
            key={'firstName2'}
            layout={formItemLayoutInline}
          /></div>
        <div className={'inline'}>
          <AntInput
            name={'Last Name 2'}
            label={'First Name'}
            notRequired={'false'}
            key={'lastName2'}
            layout={formItemLayoutInline}
          /></div>
        <div className={'inline'}>
          <AntInput
            name={'Email 2'}
            label={'Email'}
            type={'email'}
            notRequired={'false'}
            key={'email2'}
            layout={formItemLayoutInline}
          /></div>
      </div>);
    }
    return poc;
  };
  
  const onSubmit = values => {
    let POC = [];
    debugger;
    POC.push({
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
    });
    if (values.email2){
      POC.push({
        email: values.email2,
        firstName: values.firstName2,
        lastName: values.lastName2,
      });
    }
    const org = {
      ...values,
      POC,
      organizationOwnerUID: state.auth.googleAuthUser.uid,
      startTime: values.startTime.format('HH:MM A'),
      endTime: values.endTime.format('HH:MM A'),
    };
    for (let key in org){
      if (org[ key ] === undefined){
        delete org[ key ];
      }
    }
    if (orgToEdit.orgId){
      updateOrganization(orgToEdit.orgId, org, dispatch);
    }else{
      registerOrganization(org, dispatch);
    }
    
    props.history.push('/org-dashboard');
  };
  
  const days = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',
    'Saturday',
  ];
  
  const formItemLayout = {
    labelCol: {
      xs: {span: 24}, sm: {span: 24, offset: 0},
    }, wrapperCol: {
      xs: {span: 24}, sm: {span: 20},
    },
  };
  
  const formItemLayoutInline = {
    labelCol: {
      xs: {span: 24}, sm: {span: 7},
    }, wrapperCol: {
      xs: {span: 24}, sm: {span: 24},
    },
  };
  
  const formItemLayoutFullLength = {
    labelCol: {
      xs: {span: 24}, sm: {span: 24},
    }, wrapperCol: {
      xs: {span: 24}, sm: {span: 15},
    },
  };
  
  return (<StyledDiv className={'flex center'}>
    <CustomStyledCard
      style={{maxWidth: '900px', margin: '2rem 0 5rem 0'}}>
      <h1>Let's Set up your organization!</h1>
      <StyledImg src={createOrgImg} alt="undraw unexpected friends"/>
      <StyledCreateOrgForm>
        <StyledWrappedAntdForm
          layout={'vertical'}
          onSubmit={onSubmit}
          autofill={orgToEdit}
          useButton={true}
        >
          <div className={'styledGroup'}>
            <div className={'flex'}>
              <div className={'inline'}>
                <AntInput
                  name={'Organization Name'}
                  label={'Name of Organization'}
                  layout={formItemLayout}
                />
              </div>
              <div className={'inline'}>
                <AntSelect
                  labelCol={{span: 3, offset: 0}}
                  layout={formItemLayout}
                  name={'Cause Areas'}
                  label={<>
                    Types of causes <Icon type="question-circle-o"/>
                  </>}
                  mode={'multiple'}
                  style={{width: '100%'}}
                  placeholder={'Please select all that apply.'}
                  tooltipTitle={'Select all cause areas that your' +
                  ' organization helps.'}
                >
                  {state.tags.causeAreas.map(cause => {
                    return <Option key={cause}>{cause}</Option>;
                  })}
                
                </AntSelect>
              </div>
            </div>
            
            <div className={'flex'}>
              <div className={'inline'}>
                <AntInput name={'City'} notRequired={'false'}
                          layout={formItemLayout}
                />
              </div>
              <div className={'inline'}>
                <AntInput name={'State'} notRequired={'false'}
                          layout={formItemLayout}
                />
              </div>
            </div>
            <div className={'flex'}>
              <div className={'inline'}>
                <AntInput name={'Phone'} notRequired={'false'}
                          layout={formItemLayout}/>
              </div>
            </div>
          </div>
          
          <div className={'mg-tp-lg'}>
            <h4>Who is the point of contact?</h4>
          </div>
          
          {getPOCInputs()}
          {numberOfPOC === 1 ? (<><Icon type="plus-circle"
                                        style={{fontSize: '1.6rem'}}
                                        onClick={() => setNumberOfPOC(2)}/><span>
              Add another point of contact.</span></>) :
            (<><Icon type="minus-circle"
                     style={{fontSize: '1.6rem'}}
                     onClick={() => setNumberOfPOC(1)}/><span>
             Remove extra point of contact.</span></>)}
          <div className={'mg-tp-lg'}>
            <h4>What are your hours of operation?</h4>
          </div>
          
          <div className={'styledGroup'}>
            <CheckboxGroup
              name={'Days of the week'}
              options={days}
              style={{width: '100%'}}
            />
            <div className={'flex'}>
              
              <div className={'inline'}>
                <AntTimePicker name={'Start Time'} label={'What Time?'}
                               use12Hours
                               format={'h:mm a'}/>
              </div>
              <div className={'inline'}>
                <AntTimePicker name={'End Time'} use12Hours label={'To'}
                               format={'h:mm a'}/>
              </div>
            </div>
            
            
            <AntTextArea name={'About Us'} notRequired={'false'}
                         layout={formItemLayoutFullLength}
                         autosize={{minRows: 4, maxRows: 120}}/>
            <AntInput name={'Website'} type={'url'}
                      notRequired={'false'} layout={formItemLayoutFullLength}/>
          </div>
        </StyledWrappedAntdForm>
      </StyledCreateOrgForm>
    </CustomStyledCard>
  </StyledDiv>);
};

const StyledCreateOrgForm = styled.div`
margin-top: 2rem;
width: 100%;

.inline{
  width: 50%;
}

.styledGroup {
  background-color: #E8E8E8;
  border-radius: 30px;
  padding: 2rem;
  margin: 2rem;
}

i{
  margin-right: 1rem;
}

.mg-tp-lg {
  margin-top: 4rem;
}
`;

const StyledDiv = styled.div`
  background: white;
`;

const BasicStyledDiv = styled.div`
  background: #e8e8e8;
  display: flex;
  width: 80%;
  margin: 2rem auto;
  padding: 2rem;
`;

const CustomStyledCard = styled(StyledCard)`
  background: #d9d9d9;
  text-align: center;
`;

const StyledLine = styled.div`
  border-bottom: 1px solid lightgrey;
  margin-bottom: 1rem;
`;

const StyledImg = styled.img`
  width: 211px;
  margin: 2rem auto;
`;

const StyledWrappedAntdForm = styled(WrappedAntForm)``;

export default CreateOrg;
