import styled from 'styled-components';
import {Card} from 'antd';

export const StyledCard = styled(Card)`
  && {
    width: 100%;
    margin: ${props => (props.margin ? props.margin : 0)};
    max-width: ${props => (props.maxWidth ? props.maxWidth : '800px')};
    border-radius: ${({theme}) => theme.borderRadiusDefault};
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
<<<<<<< HEAD
    cursor: pointer;
    margin-bottom: 15px;
    letter-spacing: .2px;
    &:hover {
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    }

    .date {
      display:flex;
      justify-content: space-evenly;
    }

    .contact {
      display: flex;
      justify-content: space-evenly;
    }
=======
    
>>>>>>> staging
  }
`;
