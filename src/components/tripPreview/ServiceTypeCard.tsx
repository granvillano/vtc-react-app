import { Card } from '../common';
import { tripPreviewStyles as styles } from '../../screens/styles/tripPreviewStyles';
import { ServiceType } from '../../services/tripService';
import { WheelPicker, WheelPickerOption } from './WheelPicker';

type Props = {
    serviceType: ServiceType;
    options: { value: ServiceType; label: string }[];
    onSelect: (value: ServiceType) => void;
    onInteractionStart?: () => void;
    onInteractionEnd?: () => void;
};

export const ServiceTypeCard: React.FC<Props> = ({
    serviceType,
    options,
    onSelect,
    onInteractionStart,
    onInteractionEnd,
}) => {
    console.log('[ServiceTypeCard] options:', options, 'selected:', serviceType);
    return (
        <Card
            variant="default"
            padding="lg"
            style={styles.serviceCard}
        >
            <WheelPicker
                options={options as WheelPickerOption<ServiceType>[]}
                selected={serviceType}
                onSelect={onSelect}
                label="Tipo de servicio"
                helperText="Desliza arriba/abajo para cambiar"
                onInteractionStart={onInteractionStart}
                onInteractionEnd={onInteractionEnd}
            />
        </Card>
    );
};
