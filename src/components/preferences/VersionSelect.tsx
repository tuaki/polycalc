import { Select, SelectItem } from '@nextui-org/react';
import usePreferences from '@/components/preferences/PreferencesProvider';
import { VERSIONS } from '@/types/core/UnitClass';
import { VERSION_IDS, type VersionId } from '@/types/core/Version';

const reversedVersionIds = VERSION_IDS.slice().reverse();

export function VersionSelect() {
    const { preferences, setPreferences } = usePreferences();

    function onChange(versionId: string) {
        if (versionId in VERSIONS)
            setPreferences({ ...preferences, version: VERSIONS[versionId as VersionId] });
    }

    return (
        <Select
            size='sm'
            label='Version'
            selectedKeys={[ preferences.version.id ]}
            onChange={e => onChange(e.target.value)}
        >
            {reversedVersionIds.map(versionOption)}
        </Select>
    );
}

function versionOption(id: VersionId) {
    const version = VERSIONS[id];

    return (
        <SelectItem key={id} value={id}>{`(${version.gameId}) - ${version.label}`}</SelectItem>
    );
}