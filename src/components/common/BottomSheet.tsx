import React, { useCallback, useMemo, forwardRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetProps } from '@gorhom/bottom-sheet';
import { theme } from '../../theme';

interface CustomBottomSheetProps extends Partial<BottomSheetProps> {
    title?: string;
    children: React.ReactNode;
}

/**
 * Componente BottomSheet premium
 * Modal inferior deslizable con backdrop y animaciones suaves
 */
export const CustomBottomSheet = forwardRef<BottomSheet, CustomBottomSheetProps>(
    ({ title, children, snapPoints: customSnapPoints, ...props }, ref) => {
        // Snap points por defecto (altura en % de la pantalla)
        const snapPoints = useMemo(
            () => customSnapPoints || ['25%', '50%', '90%'],
            [customSnapPoints]
        );

        // Backdrop con opacidad
        const renderBackdrop = useCallback(
            (props: any) => (
                <BottomSheetBackdrop
                    {...props}
                    disappearsOnIndex={-1}
                    appearsOnIndex={0}
                    opacity={0.5}
                />
            ),
            []
        );

        return (
            <BottomSheet
                ref={ref}
                index={-1} // Cerrado por defecto
                snapPoints={snapPoints}
                enablePanDownToClose
                backdropComponent={renderBackdrop}
                backgroundStyle={styles.background}
                handleIndicatorStyle={styles.handleIndicator}
                {...props}
            >
                <View style={styles.contentContainer}>
                    {title && (
                        <View style={styles.header}>
                            <Text style={styles.title}>{title}</Text>
                        </View>
                    )}
                    <View style={styles.content}>{children}</View>
                </View>
            </BottomSheet>
        );
    }
);

CustomBottomSheet.displayName = 'CustomBottomSheet';

const styles = StyleSheet.create({
    background: {
        backgroundColor: theme.colors.background.card,
        borderTopLeftRadius: theme.borderRadius['2xl'],
        borderTopRightRadius: theme.borderRadius['2xl'],
        ...theme.shadows.xl,
    },

    handleIndicator: {
        backgroundColor: theme.colors.primary.gold,
        width: 40,
        height: 4,
    },

    contentContainer: {
        flex: 1,
    },

    header: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.light,
    },

    title: {
        ...theme.textStyles.h4,
        color: theme.colors.text.primary,
        textAlign: 'center',
    },

    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.md,
    },
});
