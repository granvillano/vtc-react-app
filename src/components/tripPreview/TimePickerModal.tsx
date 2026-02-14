import React, { useEffect, useMemo, useRef } from 'react';
import {
    Modal,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
} from 'react-native';

import { Button, Card } from '../common';
import { tripPreviewStyles as styles } from '../../screens/styles/tripPreviewStyles';

type Props = {
    visible: boolean;
    options: string[];
    selected: string;
    onSelect: (value: string) => void;
    onClose: () => void;
};

export const TimePickerModal: React.FC<Props> = ({
    visible,
    options,
    selected,
    onSelect,
    onClose,
}) => {
    const ITEM_HEIGHT = 42;
    const VISIBLE_ROWS_AROUND = 3; // Mostrar 3 arriba y 3 abajo
    const listRef = useRef<FlatList<string>>(null);
    // Opciones con padding al final para centrar la última
    const paddedOptions = useMemo(() => {
        return [...options, ...Array(VISIBLE_ROWS_AROUND).fill('')];
    }, [options]);

    const selectedIndex = useMemo(
        () => options.findIndex((o) => o === selected),
        [options, selected]
    );

    // El usuario debe pulsar para confirmar la hora, no se selecciona automáticamente al hacer scroll
    const [pendingSelection, setPendingSelection] = React.useState(selected);
    // Estado para saber qué índice está en el centro visual (solo cambia al soltar el scroll)
    const [centerIndex, setCenterIndex] = React.useState(selectedIndex + VISIBLE_ROWS_AROUND);

    // Centrar la hora seleccionada al abrir
    useEffect(() => {
        if (visible && selectedIndex >= 0) {
            setTimeout(() => {
                listRef.current?.scrollToIndex({
                    index: selectedIndex,
                    animated: false,
                    viewPosition: 0.5,
                });
            }, 10);
        }
    }, [visible, selectedIndex]);
    const handleMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const index = Math.round(offsetY / ITEM_HEIGHT);
        // Solo considerar índices válidos de las opciones reales
        const bounded = Math.min(options.length - 1, Math.max(0, index));
        const option = options[bounded];
        if (option && option !== pendingSelection) {
            setPendingSelection(option);
        }
    };

    const renderItem = ({ item, index }: { item: string; index: number }) => {
        if (!item) {
            return <View style={{ height: ITEM_HEIGHT }} />;
        }
        const isSelected = item === pendingSelection;
        return (
            <TouchableOpacity
                style={[styles.timeOption, isSelected && styles.timeOptionSelected]}
                onPress={() => setPendingSelection(item)}
                activeOpacity={0.7}
            >
                <Text
                    style={[
                        styles.timeOptionText,
                        isSelected && styles.timeOptionTextSelected,
                        isSelected && { fontSize: 32 },
                    ]}
                >
                    {item}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.timePickerOverlay}>
                <Card
                    variant="default"
                    padding="lg"
                    style={styles.timePickerModal}
                >
                    <View style={{ width: '100%', alignItems: 'flex-end', marginBottom: 8 }}>
                        <TouchableOpacity
                            onPress={onClose}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Text
                                style={{
                                    fontSize: 28,
                                    color: '#888',
                                    fontWeight: 'bold',
                                    padding: 0,
                                    margin: 0,
                                }}
                            >
                                ✕
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.sectionTitle}>Selecciona la hora</Text>
                    <Text style={styles.sheetSubtitle}>
                        Seleccionada: {pendingSelection || 'Ninguna'}
                    </Text>

                    <View style={styles.pickerContainer}>
                        <FlatList
                            ref={listRef}
                            data={paddedOptions}
                            keyExtractor={(item, idx) => (item ? item : `empty-${idx}`)}
                            renderItem={renderItem}
                            showsVerticalScrollIndicator={false}
                            snapToInterval={ITEM_HEIGHT}
                            snapToAlignment="center"
                            decelerationRate="fast"
                            onMomentumScrollEnd={handleMomentumEnd}
                            contentContainerStyle={{
                                paddingVertical: ITEM_HEIGHT * VISIBLE_ROWS_AROUND,
                            }}
                            getItemLayout={(_data, index) => ({
                                length: ITEM_HEIGHT,
                                offset: ITEM_HEIGHT * index,
                                index,
                            })}
                        />
                        <View
                            style={styles.pickerHighlight}
                            pointerEvents="none"
                        />
                    </View>

                    <Button
                        title="Confirmar hora"
                        variant="primary"
                        onPress={() => pendingSelection && onSelect(pendingSelection)}
                        style={styles.timePickerClose}
                        disabled={!pendingSelection}
                    />
                </Card>
            </View>
        </Modal>
    );
};
