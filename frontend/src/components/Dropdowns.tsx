import styled from 'styled-components';

const DropdownMenu = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.175);
  border-radius: 0.2rem;
  padding: 8px 0;
`;

const DropdownItem = styled.div`
  padding: 5px 24px;
  user-select: none;
  cursor: pointer;
  &:hover {
    background: ${(props) => props.theme.colors.dropdownHover};
  }
`;

const ActiveDropdownItem = styled(DropdownItem)`
  background: ${(props) => props.theme.colors.dropdownActiveBackground};
  color: ${(props) => props.theme.colors.dropdownActiveColor};

  &:hover {
    background: ${(props) => props.theme.colors.dropdownActiveBackground};
  }
`;

const Dropdowns = ({
  value,
  items,
  onSelectedChange,
}: {
  value: string;
  items: { text: string; value: string }[];
  onSelectedChange?: (value: string) => void;
}) => {
  return (
    <DropdownMenu>
      {items.map((p, i) =>
        value === p.value ? (
          <ActiveDropdownItem
            key={i}
            onClick={() => onSelectedChange?.(p.value)}
          >
            {p.text}
          </ActiveDropdownItem>
        ) : (
          <DropdownItem key={i} onClick={() => onSelectedChange?.(p.value)}>
            {p.text}
          </DropdownItem>
        )
      )}
    </DropdownMenu>
  );
};

export default Dropdowns;
