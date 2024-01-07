import { Card, CardBody, Select, SelectItem } from '@nextui-org/react';
import usePreferences from '@/PreferencesProvider';
import { VERSIONS } from '@/types/core/UnitClass';
import { VERSION_IDS, type VersionId } from '@/types/core/Version';

export default function VersionSelect() {
    const { preferences, setPreferences } = usePreferences();

    function onChange(versionId: string) {
        if (versionId in VERSIONS)
            setPreferences({ ...preferences, version: VERSIONS[versionId as VersionId] });
    }

    return (
        <Card>
            <CardBody>
                <Select
                    size='sm'
                    label='Version'
                    selectedKeys={[ preferences.version.id ]}
                    onChange={e => onChange(e.target.value)}
                >
                    {VERSION_IDS.map(versionOption)}
                </Select>
            </CardBody>
        </Card>
    );
}

function versionOption(id: VersionId) {
    const version = VERSIONS[id];

    return (
        <SelectItem key={id} value={id}>{`(${version.gameId}) - ${version.label}`}</SelectItem>
    );
}