import styled from 'styled-components';

const Project = styled.div`
  margin-left: 260px;
  padding: 15px;
`;

const ProjectContainer = (props: {
  children: string | JSX.Element | JSX.Element[];
}) => {
  const { children } = props;
  return <Project>{children}</Project>;
};

export default ProjectContainer;
