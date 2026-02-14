import { Card } from '../common';
import { tripPreviewStyles as styles } from '../../screens/styles/tripPreviewStyles';
import { WheelPicker, WheelPickerOption } from './WheelPicker';

type Props = {
    passengerCount: number;
    passengerOptions: number[];
    onSelect: (value: number) => void;
};

export const PassengerCard: React.FC<Props> = ({ passengerCount, passengerOptions, onSelect }) => {
    const options: WheelPickerOption<number>[] = passengerOptions.map((n) => ({
        value: n,
        label: `${n} ${n === 1 ? 'pasajero' : 'pasajeros'}`,
    }));
    console.log(
        '[PassengerCard] passengerOptions:',
        passengerOptions,
        'options:',
        options,
        'selected:',
        passengerCount
    );
    return (
        <Card
            variant="default"
            padding="lg"
            style={styles.passengerCard}
        >
            <WheelPicker
                options={options}
                selected={passengerCount}
                onSelect={onSelect}
                label="Pasajeros"
                helperText="Máximo 4 pasajeros."
                onInteractionStart={undefined}
                onInteractionEnd={undefined}
            />
        </Card>
    );
};
