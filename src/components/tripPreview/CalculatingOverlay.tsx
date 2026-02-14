import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, StyleSheet } from 'react-native';

import { theme } from '../../theme';

const DOTS = 5;
const MIN_OPACITY = 0.3;

export const CalculatingOverlay: React.FC = () => {
    const dotAnims = useRef(
        Array.from({ length: DOTS }, () => new Animated.Value(MIN_OPACITY))
    ).current;

    useEffect(() => {
        const loops = dotAnims.map((anim, index) => {
            const delay = index * 120;
            const sequence = Animated.sequence([
                Animated.delay(delay),
                Animated.timing(anim, {
                    toValue: 1,
                    duration: 320,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(anim, {
                    toValue: MIN_OPACITY,
                    duration: 380,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ]);

            const loop = Animated.loop(sequence);
            loop.start();
            return loop;
        });

        return () => {
            loops.forEach((loop) => loop.stop());
        };
    }, [dotAnims]);

    return (
        <View
            style={styles.overlay}
            pointerEvents="auto"
        >
            <Text style={styles.title}>Calculando...</Text>
            <View style={styles.dotsRow}>
                {dotAnims.map((anim, idx) => {
                    const scale = anim.interpolate({
                        inputRange: [MIN_OPACITY, 1],
                        outputRange: [0.85, 1.2],
                    });
                    return (
                        <Animated.View
                            key={idx}
                            style={[
                                styles.dot,
                                {
                                    opacity: anim,
                                    transform: [{ scale }],
                                    marginLeft: idx === 0 ? 0 : theme.spacing.sm,
                                },
                            ]}
                        />
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.92)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.lg,
        zIndex: 20,
    },
    title: {
        ...theme.textStyles.h4,
        color: '#fff',
        marginBottom: theme.spacing.md,
        fontWeight: theme.fontWeight.bold,
    },
    dotsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#fff',
    },
});
