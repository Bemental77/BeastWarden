import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { SvgXml } from 'react-native-svg'
import { LifecycleStage } from '../types'

const STAGE_SIZE: Record<LifecycleStage, number> = {
  egg: 64,
  baby: 72,
  youth: 88,
  adult: 110,
  elder: 100,
  dead: 80,
}

interface Props {
  color: string
  stage: LifecycleStage
  name: string
}

const svgTemplate = `<svg width="180" height="140" viewBox="0 0 180 140" xmlns="http://www.w3.org/2000/svg">
<rect x="-36" y="60" width="50" height="14" rx="22" ry="16" fill="{bodyColor}" transform="rotate(-24 -11 67)" />
<rect x="-44" y="68" width="22" height="12" rx="10" ry="10" fill="{accentColor}" transform="rotate(-32 -33 74)" />
<rect x="-34" y="72" width="5" height="8" rx="3" ry="3" fill="{accentColor}" transform="rotate(-28 -31.5 76)" />
<rect x="-24" y="72" width="5" height="8" rx="3" ry="3" fill="{accentColor}" transform="rotate(-28 -21.5 76)" />
<rect x="28" y="46" width="78" height="38" rx="30" ry="30" fill="{bodyColor}" />
<rect x="34" y="50" width="50" height="18" rx="16" ry="16" fill="{accentColor}" opacity="0.92" />
<rect x="40" y="58" width="34" height="12" rx="8" ry="8" fill="{highlightColor}" opacity="0.5" />
<rect x="36" y="54" width="10" height="8" rx="5" ry="5" fill="{accentColor}" transform="rotate(14 41 58)" />
<rect x="60" y="54" width="10" height="8" rx="5" ry="5" fill="{accentColor}" transform="rotate(14 65 58)" />
<rect x="18" y="14" width="72" height="38" rx="36" ry="20" fill="{wingColor}" opacity="0.96" transform="rotate(-18 54 33)" />
<rect x="12" y="12" width="6" height="22" rx="4" ry="4" fill="rgba(255,255,255,0.13)" />
<rect x="28" y="12" width="6" height="28" rx="4" ry="4" fill="rgba(255,255,255,0.13)" />
<rect x="42" y="12" width="6" height="22" rx="4" ry="4" fill="rgba(255,255,255,0.13)" />
<rect x="26" y="16" width="10" height="36" rx="6" ry="6" fill="{bodyColor}" transform="rotate(-18 31 34)" />
<rect x="44" y="18" width="8" height="30" rx="6" ry="6" fill="{bodyColor}" transform="rotate(-10 48 33)" />
<rect x="72" y="18" width="10" height="10" rx="5" ry="5" fill="{accentColor}" transform="rotate(-26 77 23)" />
<rect x="34" y="38" width="8" height="10" rx="4" ry="4" fill="{accentColor}" transform="rotate(16 38 43)" />
<rect x="52" y="38" width="8" height="10" rx="4" ry="4" fill="{accentColor}" transform="rotate(16 56 43)" />
<rect x="70" y="38" width="8" height="10" rx="4" ry="4" fill="{accentColor}" transform="rotate(16 74 43)" />
<rect x="88" y="38" width="8" height="10" rx="4" ry="4" fill="{accentColor}" transform="rotate(16 92 43)" />
<rect x="84" y="44" width="20" height="10" rx="10" ry="10" fill="{bodyColor}" transform="rotate(8 94 49)" />
<rect x="84" y="46" width="24" height="10" rx="10" ry="10" fill="{bodyColor}" transform="rotate(6 96 51)" />
<rect x="98" y="28" width="44" height="30" rx="18" ry="18" fill="{bodyColor}" />
<circle cx="110" cy="38" r="2" fill="#FFFFFF" />
<circle cx="126" cy="38" r="2" fill="#FFFFFF" />
<rect x="114" y="44" width="18" height="10" rx="8" ry="8" fill="{bodyColor}" transform="rotate(6 123 49)" />
<rect x="112" y="42" width="14" height="8" rx="8" ry="8" fill="{highlightColor}" opacity="0.6" />
<rect x="106" y="20" width="8" height="18" rx="4" ry="4" fill="{accentColor}" transform="rotate(-10 110 29)" />
<rect x="126" y="20" width="8" height="18" rx="4" ry="4" fill="{accentColor}" transform="rotate(-10 130 29)" />
<rect x="114" y="48" width="18" height="8" rx="10" ry="10" fill="{bodyColor}" />
<circle cx="118" cy="52" r="1.5" fill="#FFFFFF" />
<circle cx="124" cy="52" r="1.5" fill="#FFFFFF" />
<rect x="52" y="78" width="10" height="18" rx="6" ry="6" fill="{bodyColor}" transform="rotate(6 57 87)" />
<rect x="54" y="94" width="8" height="12" rx="6" ry="6" fill="{bodyColor}" transform="rotate(4 58 100)" />
<rect x="54" y="106" width="10" height="5" rx="4" ry="4" fill="{bodyColor}" />
<rect x="88" y="76" width="10" height="20" rx="6" ry="6" fill="{bodyColor}" transform="rotate(-2 93 86)" />
<rect x="90" y="94" width="8" height="12" rx="6" ry="6" fill="{bodyColor}" transform="rotate(-3 94 100)" />
<rect x="90" y="106" width="10" height="5" rx="4" ry="4" fill="{bodyColor}" />
<rect x="58" y="106" width="6" height="5" rx="3" ry="3" fill="{accentColor}" />
<rect x="94" y="106" width="6" height="5" rx="3" ry="3" fill="{accentColor}" />
<rect x="34" y="58" width="10" height="10" rx="5" ry="5" fill="rgba(255,255,255,0.16)" transform="rotate(12 39 63)" />
<rect x="54" y="58" width="10" height="10" rx="5" ry="5" fill="rgba(255,255,255,0.16)" transform="rotate(12 59 63)" />
<rect x="74" y="58" width="10" height="10" rx="5" ry="5" fill="rgba(255,255,255,0.16)" transform="rotate(12 79 63)" />
<rect x="94" y="58" width="10" height="10" rx="5" ry="5" fill="rgba(255,255,255,0.16)" transform="rotate(12 99 63)" />
</svg>`

export function MonsterSprite({ color, stage, name }: Props) {
  const size = STAGE_SIZE[stage]
  const scale = size / 100
  const isDead = stage === 'dead'
  const bodyColor = isDead ? '#5D5D5D' : color
  const accentColor = isDead ? '#8E8E8E' : '#F4D35E'
  const wingColor = isDead ? '#4D4D4D' : '#8B2E0B'
  const highlightColor = isDead ? '#6D6D6D' : '#D9A441'

  const finalSvg = svgTemplate
    .replace(/{bodyColor}/g, bodyColor)
    .replace(/{accentColor}/g, accentColor)
    .replace(/{wingColor}/g, wingColor)
    .replace(/{highlightColor}/g, highlightColor)

  return (
    <View style={[styles.wrapper, { width: 180 * scale, height: 140 * scale }]}>
      <View style={[styles.monsterBase, { transform: [{ scale }] }]}>
        <View style={[styles.tailSection, { backgroundColor: bodyColor }]} />
        <View style={[styles.tailFin, { backgroundColor: accentColor }]} />
        <View style={[styles.tailSpike, { backgroundColor: accentColor, left: -34 }]} />
        <View style={[styles.tailSpike, { backgroundColor: accentColor, left: -24, top: 72 }]} />

        <View style={[styles.bodyMain, { backgroundColor: bodyColor }]} />
        <View style={[styles.bodyPlate, { backgroundColor: accentColor }]} />
        <View style={[styles.bodyShadow, { backgroundColor: highlightColor }]} />
        <View style={[styles.bodyRidge, { backgroundColor: accentColor, left: 36 }]} />
        <View style={[styles.bodyRidge, { backgroundColor: accentColor, left: 60 }]} />

        <View style={[styles.wingShell, { backgroundColor: wingColor }]}>
          <View style={[styles.wingVein, { left: 12 }]} />
          <View style={[styles.wingVein, { left: 28, height: 28 }]} />
          <View style={[styles.wingVein, { left: 42, height: 22 }]} />
        </View>
        <View style={[styles.wingBone1, { backgroundColor: bodyColor }]} />
        <View style={[styles.wingBone2, { backgroundColor: bodyColor }]} />
        <View style={[styles.wingTip, { backgroundColor: accentColor }]} />

        <View style={[styles.dorsalSpike, { backgroundColor: accentColor, left: 34 }]} />
        <View style={[styles.dorsalSpike, { backgroundColor: accentColor, left: 52 }]} />
        <View style={[styles.dorsalSpike, { backgroundColor: accentColor, left: 70 }]} />
        <View style={[styles.dorsalSpike, { backgroundColor: accentColor, left: 88 }]} />

        <View style={[styles.neckSegment, { backgroundColor: bodyColor }]} />
        <View style={[styles.neckSegment, { backgroundColor: bodyColor, left: 84, top: 46, width: 24, height: 10, transform: [{ rotate: '6deg' }] }]} />
        <View style={[styles.headCap, { backgroundColor: bodyColor }]}>
          <View style={[styles.eye, { left: 10 }]} />
          <View style={[styles.eye, { right: 10 }]} />
          <View style={[styles.snout, { backgroundColor: bodyColor }]} />
          <View style={[styles.cheek, { backgroundColor: highlightColor }]} />
          <View style={[styles.horn, { left: 6, backgroundColor: accentColor }]} />
          <View style={[styles.horn, { right: 6, backgroundColor: accentColor }]} />
        </View>

        <View style={[styles.jawLower, { backgroundColor: bodyColor }]} />
        <View style={[styles.tooth, { left: 10 }]} />
        <View style={[styles.tooth, { left: 16 }]} />

        <View style={[styles.frontLegUpper, { backgroundColor: bodyColor }]} />
        <View style={[styles.frontLegLower, { backgroundColor: bodyColor }]} />
        <View style={[styles.frontFoot, { backgroundColor: bodyColor }]} />
        <View style={[styles.backLegUpper, { backgroundColor: bodyColor }]} />
        <View style={[styles.backLegLower, { backgroundColor: bodyColor }]} />
        <View style={[styles.backFoot, { backgroundColor: bodyColor }]} />

        <View style={[styles.claw, { left: 58, backgroundColor: accentColor }]} />
        <View style={[styles.claw, { left: 94, backgroundColor: accentColor }]} />

        <View style={[styles.scaleDetail, { left: 34 }]} />
        <View style={[styles.scaleDetail, { left: 54 }]} />
        <View style={[styles.scaleDetail, { left: 74 }]} />
        <View style={[styles.scaleDetail, { left: 94 }]} />
      </View>
      {isDead && <Text style={styles.deadLabel}>DECEASED</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  monsterBase: {
    position: 'relative',
    width: 160,
    height: 110,
  },
  tailSection: {
    position: 'absolute',
    left: -36,
    top: 60,
    width: 50,
    height: 14,
    borderTopLeftRadius: 22,
    borderBottomLeftRadius: 22,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    transform: [{ rotate: '-24deg' }],
  },
  tailFin: {
    position: 'absolute',
    left: -44,
    top: 68,
    width: 22,
    height: 12,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    transform: [{ rotate: '-32deg' }],
  },
  tailSpike: {
    position: 'absolute',
    top: 72,
    width: 5,
    height: 8,
    borderRadius: 3,
    transform: [{ rotate: '-28deg' }],
  },
  bodyMain: {
    position: 'absolute',
    left: 28,
    top: 46,
    width: 78,
    height: 38,
    borderRadius: 30,
  },
  bodyPlate: {
    position: 'absolute',
    left: 34,
    top: 50,
    width: 50,
    height: 18,
    borderRadius: 16,
    opacity: 0.92,
  },
  bodyShadow: {
    position: 'absolute',
    left: 40,
    top: 58,
    width: 34,
    height: 12,
    borderRadius: 8,
    opacity: 0.5,
  },
  bodyRidge: {
    position: 'absolute',
    top: 54,
    width: 10,
    height: 8,
    borderRadius: 5,
    transform: [{ rotate: '14deg' }],
  },
  wingShell: {
    position: 'absolute',
    left: 18,
    top: 14,
    width: 72,
    height: 38,
    borderTopLeftRadius: 36,
    borderBottomLeftRadius: 34,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 20,
    transform: [{ rotate: '-18deg' }],
    opacity: 0.96,
  },
  wingVein: {
    position: 'absolute',
    top: 12,
    width: 6,
    height: 22,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.13)',
  },
  wingBone1: {
    position: 'absolute',
    left: 26,
    top: 16,
    width: 10,
    height: 36,
    borderRadius: 6,
    transform: [{ rotate: '-18deg' }],
  },
  wingBone2: {
    position: 'absolute',
    left: 44,
    top: 18,
    width: 8,
    height: 30,
    borderRadius: 6,
    transform: [{ rotate: '-10deg' }],
  },
  wingTip: {
    position: 'absolute',
    left: 72,
    top: 18,
    width: 10,
    height: 10,
    borderRadius: 5,
    transform: [{ rotate: '-26deg' }],
  },
  dorsalSpike: {
    position: 'absolute',
    top: 38,
    width: 8,
    height: 10,
    borderRadius: 4,
    transform: [{ rotate: '16deg' }],
  },
  neckSegment: {
    position: 'absolute',
    left: 84,
    top: 44,
    width: 20,
    height: 10,
    borderRadius: 10,
    transform: [{ rotate: '8deg' }],
  },
  headCap: {
    position: 'absolute',
    left: 98,
    top: 28,
    width: 44,
    height: 30,
    borderRadius: 18,
  },
  eye: {
    position: 'absolute',
    top: 10,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  snout: {
    position: 'absolute',
    left: 14,
    top: 16,
    width: 18,
    height: 10,
    borderRadius: 8,
    transform: [{ rotate: '6deg' }],
  },
  cheek: {
    position: 'absolute',
    left: 12,
    top: 14,
    width: 14,
    height: 8,
    borderRadius: 8,
    opacity: 0.6,
  },
  horn: {
    position: 'absolute',
    top: -8,
    width: 8,
    height: 18,
    borderRadius: 4,
    transform: [{ rotate: '-10deg' }],
  },
  jawLower: {
    position: 'absolute',
    left: 14,
    top: 24,
    width: 18,
    height: 8,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  tooth: {
    position: 'absolute',
    top: 28,
    width: 3,
    height: 6,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  frontLegUpper: {
    position: 'absolute',
    left: 52,
    top: 78,
    width: 10,
    height: 18,
    borderRadius: 6,
    transform: [{ rotate: '6deg' }],
  },
  frontLegLower: {
    position: 'absolute',
    left: 54,
    top: 94,
    width: 8,
    height: 12,
    borderRadius: 6,
    transform: [{ rotate: '4deg' }],
  },
  frontFoot: {
    position: 'absolute',
    left: 54,
    top: 106,
    width: 10,
    height: 5,
    borderRadius: 4,
  },
  backLegUpper: {
    position: 'absolute',
    left: 88,
    top: 76,
    width: 10,
    height: 20,
    borderRadius: 6,
    transform: [{ rotate: '-2deg' }],
  },
  backLegLower: {
    position: 'absolute',
    left: 90,
    top: 94,
    width: 8,
    height: 12,
    borderRadius: 6,
    transform: [{ rotate: '-3deg' }],
  },
  backFoot: {
    position: 'absolute',
    left: 90,
    top: 106,
    width: 10,
    height: 5,
    borderRadius: 4,
  },
  claw: {
    position: 'absolute',
    top: 106,
    width: 6,
    height: 5,
    borderRadius: 3,
  },
  scaleDetail: {
    position: 'absolute',
    top: 58,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.16)',
    transform: [{ rotate: '12deg' }],
  },
  deadLabel: {
    color: '#E0E0E0',
    fontFamily: 'monospace',
    fontSize: 11,
    letterSpacing: 2,
    marginTop: 8,
  },
})
