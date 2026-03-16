import React, { useState } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface GlassButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    iconOnly?: boolean;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
    children,
    className = '',
    onClick,
    iconOnly = false,
    ...props
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    // "Espresso & Cream" Liquid Glass Parameters
    const lightDirection = 120;
    const highlightColor = 'rgba(255, 255, 255,'; // we append alpha
    const glassBackground = 'rgba(255, 255, 255,';
    const innerShadowColor = 'rgba(92, 61, 46,'; // secondary
    const outerShadowColor = 'rgba(92, 61, 46,';
    const glassBorderColor = 'rgba(255, 255, 255,';

    const blurAmount = 16;
    const highlightIntensity = 0.8;
    const glassOpacity = 0.4;
    const innerShadowIntensity = 0.15;
    const outerShadowIntensity = 0.1;
    const borderOpacity = 0.4;
    const borderHighlightOpacity = 0.6;
    const borderRadius = iconOnly ? '50%' : '12px';

    const backgroundStyle = `
        linear-gradient(${lightDirection}deg, 
            ${highlightColor}${highlightIntensity * 0.8}) 0%,
            transparent 40%
        ),
        linear-gradient(${lightDirection + 90}deg, 
            ${highlightColor}${highlightIntensity * 0.3}) 0%,
            transparent 30%
        ),
        linear-gradient(${lightDirection + 135}deg, 
            ${highlightColor}${highlightIntensity * 0.6}) 0%,
            ${glassBackground}${glassOpacity}) 50%,
            ${innerShadowColor}${innerShadowIntensity * 0.3}) 100%
        ),
        linear-gradient(to bottom, 
            transparent 0%, 
            ${innerShadowColor}0.03) 100%
        )
    `;

    const boxShadowStyle = `
        0 8px 32px 0 ${outerShadowColor}${outerShadowIntensity}),
        inset 0 0 0 1px ${glassBorderColor}${borderOpacity}),
        inset 0 1px 1px 0 ${highlightColor}${borderHighlightOpacity}),
        inset 0 -4px 8px 0 ${innerShadowColor}${innerShadowIntensity})
    `;

    return (
        <motion.button
            onClick={onClick}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onTapStart={() => setIsPressed(true)}
            onTapCancel={() => setIsPressed(false)}
            onTap={() => setIsPressed(false)}
            animate={{
                scale: isPressed ? 0.95 : isHovered ? 1.05 : 1,
                y: isHovered && !isPressed ? -2 : 0,
            }}
            transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25,
            }}
            style={{
                background: backgroundStyle,
                boxShadow: boxShadowStyle,
                backdropFilter: `blur(${blurAmount}px)`,
                WebkitBackdropFilter: `blur(${blurAmount}px)`,
                borderRadius: borderRadius,
            }}
            className={`relative inline-flex items-center justify-center text-foreground font-medium outline-none ${iconOnly ? 'w-10 h-10 p-2' : 'px-4 py-2'} ${className}`}
            {...props}
        >
            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>

            {/* Glossy Overlay Highlight */}
            <div
                className="absolute inset-0 rounded-inherit pointer-events-none"
                style={{
                    borderRadius: 'inherit',
                    background: `linear-gradient(${lightDirection}deg, 
                        ${highlightColor}${borderHighlightOpacity * 1.5}) 0%, 
                        transparent 30%, 
                        transparent 70%, 
                        ${innerShadowColor}${borderOpacity}) 100%)`,
                    padding: '1px',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                }}
            />
        </motion.button>
    );
};
