import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
`;

export const Nav = styled.nav`
    height: 60px;
    border: 1px solid black;
`;

export const SubContainer = styled.section`
    width: 100%;
    border: 1px solid black;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
`;

export const Content = styled.section`
    width: 80%;
    border: 1px solid black;
`;


export const Header = styled.div``;

export const Group = styled.div`
    border: 1px solid black;
    margin: 1px;
    padding: 10px;
`;

export const GroupTitle = styled.p`
    border: 1px solid black;
    font-size: 24px;
`;

export const EndpointList = styled.div``;

export const Endpoint = styled.p`
    border: 1px solid black;
`;

export const RulesContainer = styled.div`
    border: 1px solid black;
    padding: 10px;
    overflow: scroll;
`;