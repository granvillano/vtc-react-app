import React from 'react';
import { Text, View } from 'react-native';

import { Card } from '../common';
import { tripPreviewStyles as styles } from '../../screens/styles/tripPreviewStyles';

type BreakdownItem = { concept: string; amount: string | number };

type Props = {
    canEstimate: boolean;
    breakdown: BreakdownItem[];
    total?: number;
    baseTariff?: string;
    horario?: string;
    distanceAppliedKm?: number;
    formatCurrency: (amount: string | number | undefined | null) => string;
};

export const PricingCard: React.FC<Props> = ({
    canEstimate,
    breakdown,
    total,
    baseTariff,
    horario,
    distanceAppliedKm,
    formatCurrency,
}) => (
    <Card
        variant="default"
        padding="lg"
        style={styles.pricingCard}
    >
        <Text style={styles.sectionTitle}>Estimación de precio</Text>
        {!canEstimate ? (
            <Text style={styles.helperText}>Selecciona la fecha para ver el precio.</Text>
        ) : (
            <>
                <View style={styles.pricingMeta}>
                    {baseTariff ? <Text style={styles.metaText}>Tarifa: {baseTariff}</Text> : null}
                    {horario ? <Text style={styles.metaText}>Horario: {horario}</Text> : null}
                    {distanceAppliedKm ? (
                        <Text style={styles.metaText}>
                            Km aplicados: {distanceAppliedKm.toFixed(2)} km
                        </Text>
                    ) : null}
                </View>

                {breakdown.length > 0 ? (
                    <View style={styles.breakdownList}>
                        {breakdown.map((item, index) => (
                            <View
                                key={`${item.concept}-${index}`}
                                style={styles.breakdownRow}
                            >
                                <Text style={styles.breakdownConcept}>{item.concept}</Text>
                                <Text style={styles.breakdownAmount}>
                                    {formatCurrency(item.amount)}
                                </Text>
                            </View>
                        ))}
                    </View>
                ) : (
                    <Text style={styles.helperText}>Aún sin desglosar precio.</Text>
                )}

                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total estimado</Text>
                    <Text style={styles.totalAmount}>{formatCurrency(total)}</Text>
                </View>
            </>
        )}
    </Card>
);
