import {ExtendedHuntingAreaData} from '@state/data/dataSelectors';
import {Role} from '@state/types';
import {map} from 'lodash';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import styled from 'styled-components';
import RadioButtonCard from '../../components/RadioButtonCard';
import Text from '../../components/Text';
import {strings} from '../../strings';
import MemberHuntingAreas from './MemberHuntingAreas';

interface MemberRolesProps {
  disabled?: boolean;
  selectedRole: Role;
  showRoleOption?: (role: Role) => boolean;
  onChange: (value: {role: Role; huntingAreas: string[]}) => void;
  availableHuntingAreas: ExtendedHuntingAreaData[];
  huntingAreas: string[];
}

const MemberRoles: React.FC<MemberRolesProps> = ({
  showRoleOption = () => true,
  onChange,
  availableHuntingAreas,
  huntingAreas,
  selectedRole,
  disabled = false,
}) => {
  const [selectedTenantUserAreas, setSelectedTenantUserAreas] =
    useState<string[]>(huntingAreas);

  useEffect(() => {
    setSelectedTenantUserAreas(huntingAreas);
  }, []);

  const handleRoleChange = (role: Role) => {
    if (role === Role.farmer) {
      onChange({role, huntingAreas: selectedTenantUserAreas});
    } else {
      onChange({role, huntingAreas});
    }
  };

  const handleHuntingAreasChange = (huntingAreas: string[]) => {
    setSelectedTenantUserAreas(huntingAreas);
    if (selectedRole === Role.farmer) {
      onChange({role: selectedRole, huntingAreas: huntingAreas});
    } else if (selectedRole) {
      onChange({role: selectedRole, huntingAreas});
    }
  };

  return (
    <Column>
      <InfoText weight={Text.Weight.medium}>{`${strings.roleLabel}:`}</InfoText>
      {map(Role, (role: Role) => {
        if (!showRoleOption(role)) {
          return;
        }

        return (
          <StyledRadioButtonCard
            key={role}
            variant={RadioButtonCard.Variant.rounded}
            label={strings.role[role]}
            selected={role === selectedRole}
            onPress={() => handleRoleChange(role)}
            value={role}
            disabled={disabled}
          />
        );
      })}
      {selectedRole === Role.farmer && (
        <MemberHuntingAreas
          disabled={disabled}
          onChange={handleHuntingAreasChange}
          availableHuntingAreas={availableHuntingAreas}
          selectedHuntingAreas={selectedTenantUserAreas}
        />
      )}
    </Column>
  );
};

const Column = styled(View)`
  margin-top: 24px;
`;

const InfoText = styled(Text.M)`
  margin-bottom: 8px;
`;

const StyledRadioButtonCard = styled(RadioButtonCard)`
  margin-bottom: 8px;
`;

export default MemberRoles;
