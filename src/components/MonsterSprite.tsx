/**
 * MonsterSprite.tsx
 *
 * Dragon sprite built from ~70 individually named SVG primitives.
 * Every body region lives inside its own <G id="..."> group so each
 * part can be targeted independently by Animated transforms.
 *
 * Animation entry points (wrap the relevant <G> with an Animated.View
 * or pass a `transform` prop via react-native-svg's G component):
 *   #tail          – wagging / curl cycle
 *   #wingLeft      – flap cycle (rotate around wing root)
 *   #wingRight     – flap cycle
 *   #dorsalSpikes  – idle pulse scale
 *   #neck          – head-bob translate Y
 *   #head          – head-bob / look-left-right
 *   #frontLegLeft  – walk cycle
 *   #frontLegRight – walk cycle
 *   #backLegLeft   – walk cycle
 *   #backLegRight  – walk cycle
 *   #breathEffect  – show/hide + opacity for attack
 *   #eyeGlow       – pulse opacity for idle
 *   #deadOverlay   – fade in on death
 *
 * ViewBox: "0 0 250 205"
 * Dragon faces right, side-view.
 */

import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Svg, {
  Path,
  Polygon,
  Circle,
  Ellipse,
  G,
} from 'react-native-svg'
import { LifecycleStage } from '../types'

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function shadeHex(hex: string, amount: number): string {
  const clean = hex.replace('#', '')
  const num = parseInt(clean, 16)
  const r = Math.max(0, Math.min(255, (num >> 16) + amount))
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount))
  const b = Math.max(0, Math.min(255, (num & 0xff) + amount))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

// ─────────────────────────────────────────────
// Stage → display scale
// ─────────────────────────────────────────────

const STAGE_SCALE: Record<LifecycleStage, number> = {
  egg: 0.55,
  baby: 0.65,
  youth: 0.78,
  adult: 1.0,
  elder: 0.92,
  dead: 0.80,
}

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────

interface Props {
  /** Hex color for the main body (e.g. "#3A7D44") */
  color: string
  stage: LifecycleStage
  name: string
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export function MonsterSprite({ color, stage, name }: Props) {
  const scale = STAGE_SCALE[stage]
  const isDead = stage === 'dead'

  // Colour palette derived from the primary body colour
  const body = isDead ? '#5D5D5D' : color
  const bodyDark = isDead ? '#3D3D3D' : shadeHex(color, -40)
  const bodyMid = isDead ? '#4A4A4A' : shadeHex(color, -22)
  const belly = isDead ? '#7D7D7D' : shadeHex(color, 28)
  const accent = isDead ? '#8E8E8E' : '#F4D35E'
  const accentDark = isDead ? '#6E6E6E' : '#C9972E'
  const wing = isDead ? '#4D4D4D' : '#7B2208'
  const wingLight = isDead ? '#606060' : '#A03010'
  const tooth = 'rgba(255,255,248,0.92)'
  const tongue = isDead ? '#888' : '#C0392B'

  const W = 250
  const H = 205

  return (
    <View style={styles.wrapper}>
      <Svg
        width={W * scale}
        height={H * scale}
        viewBox={`0 0 ${W} ${H}`}
      >

        {/* ════════════════════════════════════════ */}
        {/*  GROUND SHADOW                          */}
        {/* ════════════════════════════════════════ */}
        <G id="groundShadow">
          <Ellipse
            id="shadowEllipse"
            cx="118" cy="195" rx="72" ry="7"
            fill="rgba(0,0,0,0.22)"
          />
        </G>

        {/* ════════════════════════════════════════ */}
        {/*  TAIL                                   */}
        {/* ════════════════════════════════════════ */}
        <G id="tail">

          {/* Tail base – widest, connects to body */}
          <Path
            id="tailBase"
            d="M 82 107 C 74 104 63 101 55 106 C 49 110 47 117 52 121 C 58 126 72 123 82 116 Z"
            fill={body}
          />

          {/* Tail mid section */}
          <Path
            id="tailMid"
            d="M 55 106 C 44 103 34 107 27 113 C 20 118 19 125 24 129 C 30 133 44 130 53 122 C 56 117 55 112 55 106 Z"
            fill={body}
          />

          {/* Tail tip – darkened, tapers to point */}
          <Path
            id="tailTip"
            d="M 27 113 C 17 115 8 120 4 126 C 2 130 4 134 8 134 C 15 135 24 129 28 121 C 28 118 27 115 27 113 Z"
            fill={bodyMid}
          />

          {/* Tail underside highlight */}
          <Path
            id="tailUnderside"
            d="M 55 118 C 44 125 31 130 20 130 C 28 133 44 130 55 122 Z"
            fill={belly}
            opacity={0.45}
          />

          {/* Tail dorsal spike 1 */}
          <Polygon
            id="tailSpike1"
            points="63,100 59,89 55,100"
            fill={accent}
          />

          {/* Tail dorsal spike 2 */}
          <Polygon
            id="tailSpike2"
            points="48,105 45,94 41,105"
            fill={accent}
          />

          {/* Tail dorsal spike 3 */}
          <Polygon
            id="tailSpike3"
            points="33,110 30,99 26,110"
            fill={accent}
          />

          {/* Tail fin – decorative barbed tip */}
          <Polygon
            id="tailFin"
            points="8,130 2,117 12,122 18,113 22,124"
            fill={wing}
            opacity={0.88}
          />

          {/* Tail fin leading bone */}
          <Path
            id="tailFinBone"
            d="M 8 130 L 2 117"
            stroke={bodyDark}
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Tail fin secondary bone */}
          <Path
            id="tailFinBone2"
            d="M 12 122 L 18 113"
            stroke={bodyDark}
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
          />

        </G>

        {/* ════════════════════════════════════════ */}
        {/*  BACK RIGHT LEG  (further from viewer)  */}
        {/* ════════════════════════════════════════ */}
        <G id="backLegRight">

          <Path
            id="backUpperLegR"
            d="M 142 113 C 148 112 155 115 157 123 C 159 130 156 138 151 140 C 146 142 141 139 139 132 C 137 125 138 118 142 113 Z"
            fill={bodyMid}
          />

          <Path
            id="backLowerLegR"
            d="M 151 140 C 153 145 153 152 151 158 C 149 163 145 165 142 162 C 139 159 139 152 141 146 C 144 142 148 141 151 140 Z"
            fill={bodyMid}
          />

          <Circle
            id="backKneeCapR"
            cx="153" cy="136" r="4"
            fill={body}
          />

          <Path
            id="backFootR"
            d="M 138 158 C 142 155 149 155 154 158 C 156 162 154 167 147 168 C 140 168 136 164 138 158 Z"
            fill={bodyMid}
          />

          <Polygon id="backClaw1R" points="138,165 132,170 136,158" fill={accent} />
          <Polygon id="backClaw2R" points="145,168 142,174 138,165" fill={accent} />
          <Polygon id="backClaw3R" points="152,167 152,173 147,166" fill={accent} />

        </G>

        {/* ════════════════════════════════════════ */}
        {/*  BACK LEFT LEG  (closer to viewer)      */}
        {/* ════════════════════════════════════════ */}
        <G id="backLegLeft">

          <Path
            id="backUpperLegL"
            d="M 120 115 C 127 114 134 117 136 125 C 138 133 134 141 129 143 C 124 145 118 142 116 134 C 114 126 116 119 120 115 Z"
            fill={body}
          />

          <Path
            id="backLowerLegL"
            d="M 129 143 C 131 148 131 155 129 161 C 127 166 122 168 119 165 C 116 162 116 155 118 148 C 121 144 125 143 129 143 Z"
            fill={body}
          />

          <Circle
            id="backKneeCapL"
            cx="132" cy="139" r="4"
            fill={accent}
            opacity={0.75}
          />

          <Path
            id="backFootL"
            d="M 115 161 C 119 158 127 158 131 161 C 133 165 131 170 124 171 C 117 171 113 167 115 161 Z"
            fill={body}
          />

          <Polygon id="backClaw1L" points="115,168 108,173 113,161" fill={accent} />
          <Polygon id="backClaw2L" points="122,171 120,177 115,168" fill={accent} />
          <Polygon id="backClaw3L" points="130,169 130,175 124,168" fill={accent} />

        </G>

        {/* ════════════════════════════════════════ */}
        {/*  BODY                                   */}
        {/* ════════════════════════════════════════ */}
        <G id="body">

          {/* Main body silhouette */}
          <Path
            id="bodyMain"
            d="M 83 82 C 90 73 103 68 120 67 C 138 66 153 70 160 79 C 166 86 165 98 161 109 C 157 120 147 127 130 129 C 113 131 96 127 86 118 C 77 110 75 97 83 82 Z"
            fill={body}
          />

          {/* Top ridge / dorsal spine valley – slightly darker */}
          <Path
            id="bodyTopRidge"
            d="M 86 82 C 95 73 108 68 121 67 C 136 66 150 70 158 79 C 150 74 136 71 121 71 C 106 71 93 75 86 82 Z"
            fill={bodyDark}
            opacity={0.45}
          />

          {/* Belly / underside – lighter */}
          <Path
            id="bodyBelly"
            d="M 90 116 C 98 127 112 131 126 131 C 140 131 153 126 161 116 C 153 122 140 127 126 127 C 112 127 98 122 90 116 Z"
            fill={belly}
            opacity={0.72}
          />

          {/* Belly central sheen */}
          <Path
            id="bodyBellySheen"
            d="M 103 110 C 112 117 122 119 134 117 C 126 121 113 121 103 116 Z"
            fill={belly}
            opacity={0.38}
          />

          {/* Body scales – 8 diamond shapes */}
          <Polygon id="bodyScale1"  points="95,84  100,79  105,84  100,89"  fill={bodyDark} opacity={0.48} />
          <Polygon id="bodyScale2"  points="110,81  115,76  120,81  115,86" fill={bodyDark} opacity={0.48} />
          <Polygon id="bodyScale3"  points="126,80  131,75  136,80  131,85" fill={bodyDark} opacity={0.48} />
          <Polygon id="bodyScale4"  points="142,81  147,77  152,81  147,86" fill={bodyDark} opacity={0.42} />
          <Polygon id="bodyScale5"  points="98,96   103,91  108,96  103,101" fill={bodyDark} opacity={0.40} />
          <Polygon id="bodyScale6"  points="113,94  118,89  123,94  118,99" fill={bodyDark} opacity={0.40} />
          <Polygon id="bodyScale7"  points="129,93  134,88  139,93  134,98" fill={bodyDark} opacity={0.40} />
          <Polygon id="bodyScale8"  points="144,93  149,89  154,93  149,98" fill={bodyDark} opacity={0.36} />

          {/* Flank sheen spots */}
          <Ellipse id="bodySheen1" cx="102" cy="86" rx="9" ry="6" fill="rgba(255,255,255,0.07)" />
          <Ellipse id="bodySheen2" cx="136" cy="85" rx="7" ry="5" fill="rgba(255,255,255,0.05)" />

        </G>

        {/* ════════════════════════════════════════ */}
        {/*  FRONT RIGHT LEG  (further)             */}
        {/* ════════════════════════════════════════ */}
        <G id="frontLegRight">

          <Path
            id="frontUpperLegR"
            d="M 104 118 C 110 117 116 120 118 128 C 120 135 117 143 112 145 C 107 147 101 144 99 136 C 97 128 99 121 104 118 Z"
            fill={bodyMid}
          />

          <Path
            id="frontLowerLegR"
            d="M 112 145 C 114 150 114 157 112 163 C 110 168 106 170 103 167 C 100 164 100 157 102 151 C 105 147 109 146 112 145 Z"
            fill={bodyMid}
          />

          <Circle
            id="frontKneeCapR"
            cx="115" cy="141" r="4"
            fill={body}
            opacity={0.85}
          />

          <Path
            id="frontFootR"
            d="M 98 163 C 102 160 110 160 114 163 C 116 167 114 172 108 173 C 101 173 96 169 98 163 Z"
            fill={bodyMid}
          />

          <Polygon id="frontClaw1R" points="98,170  92,175 96,163"  fill={accent} />
          <Polygon id="frontClaw2R" points="105,173 103,179 98,170" fill={accent} />
          <Polygon id="frontClaw3R" points="112,172 112,178 107,170" fill={accent} />

        </G>

        {/* ════════════════════════════════════════ */}
        {/*  FRONT LEFT LEG  (closer to viewer)     */}
        {/* ════════════════════════════════════════ */}
        <G id="frontLegLeft">

          <Path
            id="frontUpperLegL"
            d="M 88 116 C 95 115 102 118 104 126 C 106 134 102 142 97 144 C 92 146 86 143 84 135 C 82 127 84 119 88 116 Z"
            fill={body}
          />

          <Path
            id="frontLowerLegL"
            d="M 97 144 C 99 149 99 157 97 163 C 95 168 90 170 87 167 C 84 164 84 157 86 150 C 89 146 93 145 97 144 Z"
            fill={body}
          />

          <Circle
            id="frontKneeCapL"
            cx="100" cy="140" r="4"
            fill={accent}
            opacity={0.72}
          />

          <Path
            id="frontFootL"
            d="M 83 163 C 87 160 95 160 99 163 C 101 167 99 172 93 173 C 86 173 81 169 83 163 Z"
            fill={body}
          />

          <Polygon id="frontClaw1L" points="83,170  77,175 81,163"  fill={accent} />
          <Polygon id="frontClaw2L" points="90,173 88,179 83,170"   fill={accent} />
          <Polygon id="frontClaw3L" points="97,172 97,178 92,170"   fill={accent} />

        </G>

        {/* ════════════════════════════════════════ */}
        {/*  LEFT WING  (primary – most visible)    */}
        {/* ════════════════════════════════════════ */}
        <G id="wingLeft">

          {/* Main membrane – large fan shape */}
          <Path
            id="wingLeftMembrane"
            d="M 128 80 C 137 70 154 57 176 43 C 191 32 208 22 222 16 C 232 12 240 13 241 20 C 238 28 227 37 214 46 C 200 55 186 64 175 73 C 168 80 160 84 150 84 Z"
            fill={wing}
            opacity={0.94}
          />

          {/* Membrane inner lighter layer */}
          <Path
            id="wingLeftMembraneInner"
            d="M 134 78 C 144 68 162 55 182 42 C 196 32 210 23 220 17 C 210 26 194 38 180 50 C 166 62 154 72 142 79 Z"
            fill={wingLight}
            opacity={0.30}
          />

          {/* Leading arm bone */}
          <Path
            id="wingLeftArm"
            d="M 129 79 C 146 67 176 48 200 28 C 210 20 220 14 226 12"
            stroke={bodyDark}
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Finger bone 1 */}
          <Path
            id="wingLeftBone1"
            d="M 138 79 C 155 64 180 46 206 28"
            stroke={bodyDark}
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Finger bone 2 */}
          <Path
            id="wingLeftBone2"
            d="M 147 79 C 164 65 188 50 216 34"
            stroke={bodyDark}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Finger bone 3 */}
          <Path
            id="wingLeftBone3"
            d="M 155 79 C 172 67 194 55 222 44"
            stroke={bodyDark}
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />

          {/* Membrane vein detail */}
          <Path
            id="wingLeftVein1"
            d="M 142 77 C 160 62 180 48 198 35"
            stroke="rgba(255,255,255,0.10)"
            strokeWidth="1"
            fill="none"
          />
          <Path
            id="wingLeftVein2"
            d="M 150 77 C 168 63 188 50 208 39"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
            fill="none"
          />
          <Path
            id="wingLeftVein3"
            d="M 157 79 C 174 68 192 57 212 48"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="1"
            fill="none"
          />

          {/* Wing finger tips */}
          <Polygon id="wingLeftTip1" points="222,12 216,5  228,10"  fill={accent} />
          <Polygon id="wingLeftTip2" points="202,28 196,20 208,26"  fill={accent} />
          <Polygon id="wingLeftTip3" points="212,34 206,26 218,32"  fill={accent} />
          <Polygon id="wingLeftTip4" points="218,44 214,36 224,42"  fill={accent} />

          {/* Claw at main wing bend */}
          <Path
            id="wingLeftClaw"
            d="M 196 28 C 192 23 191 16 196 14 C 199 17 198 23 196 28 Z"
            fill={accentDark}
          />

        </G>

        {/* ════════════════════════════════════════ */}
        {/*  RIGHT WING  (smaller – behind body)    */}
        {/* ════════════════════════════════════════ */}
        <G id="wingRight">

          <Path
            id="wingRightMembrane"
            d="M 90 72 C 83 68 71 55 65 42 C 57 26 55 12 63 8 C 67 12 73 28 80 45 C 87 60 93 70 101 75 Z"
            fill={wing}
            opacity={0.62}
          />

          {/* Leading arm bone */}
          <Path
            id="wingRightArm"
            d="M 92 71 C 75 58 59 40 47 24"
            stroke={bodyDark}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Finger bone 1 */}
          <Path
            id="wingRightBone1"
            d="M 87 70 C 70 56 55 38 41 22"
            stroke={bodyDark}
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Finger bone 2 */}
          <Path
            id="wingRightBone2"
            d="M 82 71 C 67 58 53 42 40 28"
            stroke={bodyDark}
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
          />

          <Polygon id="wingRightTip1" points="47,24 43,14 53,20" fill={accent} opacity={0.72} />
          <Polygon id="wingRightTip2" points="40,28 37,18 47,24" fill={accent} opacity={0.72} />

        </G>

        {/* ════════════════════════════════════════ */}
        {/*  DORSAL SPIKES  (along spine)           */}
        {/* ════════════════════════════════════════ */}
        <G id="dorsalSpikes">

          <Polygon id="dorsalSpike1" points="90,73  86,61  94,69"  fill={accent} />
          <Polygon id="dorsalSpike2" points="102,70 98,56  106,67" fill={accent} />
          <Polygon id="dorsalSpike3" points="114,68 110,52 118,65" fill={accent} />
          <Polygon id="dorsalSpike4" points="126,67 123,51 131,64" fill={accent} />
          <Polygon id="dorsalSpike5" points="138,68 135,53 143,65" fill={accent} />
          <Polygon id="dorsalSpike6" points="150,70 148,57 155,68" fill={accent} />

          {/* Inner shadow on each spike base */}
          <Polygon id="dorsalSpike1Shadow" points="90,73 88,67 92,70"  fill={accentDark} opacity={0.5} />
          <Polygon id="dorsalSpike2Shadow" points="102,70 100,63 104,67" fill={accentDark} opacity={0.5} />
          <Polygon id="dorsalSpike3Shadow" points="114,68 112,60 116,65" fill={accentDark} opacity={0.5} />
          <Polygon id="dorsalSpike4Shadow" points="126,67 124,59 128,64" fill={accentDark} opacity={0.5} />
          <Polygon id="dorsalSpike5Shadow" points="138,68 136,60 140,65" fill={accentDark} opacity={0.5} />
          <Polygon id="dorsalSpike6Shadow" points="150,70 148,63 152,68" fill={accentDark} opacity={0.5} />

          {/* Spine ridge line connecting spike bases */}
          <Path
            id="spineRidge"
            d="M 88 71 C 102 68 116 66 128 66 C 140 66 150 68 158 72"
            stroke={bodyMid}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity={0.55}
          />

        </G>

        {/* ════════════════════════════════════════ */}
        {/*  NECK                                   */}
        {/* ════════════════════════════════════════ */}
        <G id="neck">

          {/* Lower neck segment */}
          <Path
            id="neckLower"
            d="M 154 82 C 160 77 169 75 175 79 C 181 83 181 92 177 98 C 173 103 164 103 158 98 C 152 93 150 87 154 82 Z"
            fill={body}
          />

          {/* Upper neck segment */}
          <Path
            id="neckUpper"
            d="M 165 73 C 171 68 180 66 186 70 C 192 74 192 83 188 89 C 184 94 175 94 169 90 C 163 85 161 78 165 73 Z"
            fill={body}
          />

          {/* Neck armor plate 1 */}
          <Path
            id="neckPlate1"
            d="M 156 86 C 163 81 172 80 177 85 C 175 90 166 92 159 90 Z"
            fill={accent}
            opacity={0.65}
          />

          {/* Neck armor plate 2 */}
          <Path
            id="neckPlate2"
            d="M 167 77 C 174 72 183 72 187 77 C 185 82 176 84 170 82 Z"
            fill={accent}
            opacity={0.65}
          />

          {/* Throat – lighter underside */}
          <Path
            id="neckThroat"
            d="M 157 96 C 163 102 172 104 178 101 C 173 105 163 105 157 100 Z"
            fill={belly}
            opacity={0.55}
          />

          {/* Neck scale 1 */}
          <Polygon id="neckScale1" points="160,83 164,78 168,83 164,88" fill={bodyDark} opacity={0.38} />
          {/* Neck scale 2 */}
          <Polygon id="neckScale2" points="171,79 175,74 179,79 175,84" fill={bodyDark} opacity={0.38} />

        </G>

        {/* ════════════════════════════════════════ */}
        {/*  HEAD                                   */}
        {/* ════════════════════════════════════════ */}
        <G id="head">

          {/* Ear frill – behind cranium */}
          <Path
            id="earFrill"
            d="M 175 60 C 171 51 169 40 173 33 C 177 27 184 29 186 36 C 188 43 185 53 181 60 Z"
            fill={wing}
            opacity={0.82}
          />
          <Path
            id="earFrillBone1"
            d="M 175 60 C 173 49 173 39 177 33"
            stroke={bodyDark}
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          <Path
            id="earFrillBone2"
            d="M 179 58 C 178 48 178 40 181 35"
            stroke={bodyDark}
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
          />

          {/* Main cranium */}
          <Path
            id="headBase"
            d="M 175 62 C 179 53 188 46 199 44 C 210 42 221 47 225 56 C 229 65 224 76 215 80 C 206 85 195 82 188 76 C 181 70 176 68 175 62 Z"
            fill={body}
          />

          {/* Cranium top ridge */}
          <Path
            id="headTopRidge"
            d="M 178 60 C 185 52 195 47 205 47 C 214 47 221 52 224 59 C 218 54 208 51 198 51 C 190 51 183 54 178 60 Z"
            fill={bodyDark}
            opacity={0.40}
          />

          {/* Cheek armor plate */}
          <Path
            id="cheekArmor"
            d="M 199 70 C 206 66 216 67 220 72 C 217 77 210 79 204 77 Z"
            fill={accent}
            opacity={0.58}
          />

          {/* Snout – upper jaw */}
          <Path
            id="snoutUpper"
            d="M 188 70 C 196 65 208 64 216 69 C 222 73 224 80 222 87 C 216 82 207 80 199 80 C 193 80 188 78 186 73 Z"
            fill={body}
          />

          {/* Snout top bridge */}
          <Path
            id="snoutBridge"
            d="M 189 67 C 198 63 210 63 218 68 C 211 64 200 63 189 67 Z"
            fill={bodyDark}
            opacity={0.36}
          />

          {/* Lower jaw */}
          <Path
            id="jawLower"
            d="M 189 80 C 198 79 212 80 220 84 C 222 89 220 95 213 97 C 205 99 193 96 187 91 C 184 87 185 82 189 80 Z"
            fill={body}
          />

          {/* Jaw chin underside */}
          <Path
            id="jawChin"
            d="M 191 89 C 198 92 208 92 214 89 C 210 96 196 96 191 92 Z"
            fill={belly}
            opacity={0.48}
          />

          {/* Upper teeth */}
          <Polygon id="toothUpper1" points="195,80 193,88 197,88" fill={tooth} />
          <Polygon id="toothUpper2" points="203,79 201,88 205,88" fill={tooth} />
          <Polygon id="toothUpper3" points="211,80 209,88 213,88" fill={tooth} />

          {/* Lower teeth */}
          <Polygon id="toothLower1" points="196,88 194,81 198,81" fill={tooth} />
          <Polygon id="toothLower2" points="204,88 202,81 206,81" fill={tooth} />

          {/* Tongue base */}
          <Path
            id="tongueBase"
            d="M 214 91 C 218 88 225 88 228 93"
            stroke={tongue}
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
            opacity={0.82}
          />
          {/* Tongue fork left */}
          <Polygon id="tongueForkLeft"  points="228,93 223,99 229,96" fill={tongue} opacity={0.82} />
          {/* Tongue fork right */}
          <Polygon id="tongueForkRight" points="228,93 230,99 234,95" fill={tongue} opacity={0.82} />

          {/* Nostrils */}
          <Ellipse id="nostril1" cx="200" cy="74" rx="2.5" ry="2" fill={bodyDark} opacity={0.75} />
          <Ellipse id="nostril2" cx="208" cy="73" rx="2.5" ry="2" fill={bodyDark} opacity={0.75} />

          {/* Eye socket / orbital ring */}
          <Circle  id="eyeSocket"  cx="188" cy="63" r="9"   fill={bodyDark} opacity={0.28} />
          {/* Eye sclera */}
          <Ellipse id="eyeSclera"  cx="188" cy="63" rx="6.5" ry="5.5" fill="#E8D87A" />
          {/* Iris */}
          <Ellipse id="eyeIris"    cx="188" cy="63" rx="4.5" ry="4.5" fill="#B03020" />
          {/* Pupil – vertical slit */}
          <Ellipse id="eyePupil"   cx="188" cy="63" rx="1.5" ry="3.8" fill="#160606" />
          {/* Eye sheens */}
          <Circle  id="eyeSheen1"  cx="185" cy="60" r="1.8" fill="rgba(255,255,255,0.82)" />
          <Circle  id="eyeSheen2"  cx="190" cy="65" r="0.9" fill="rgba(255,255,255,0.50)" />

          {/* Brow ridge (over eye) */}
          <Path
            id="browRidge"
            d="M 182 57 C 186 52 192 52 196 56"
            stroke={bodyDark}
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Horn 1 – main swept-back horn */}
          <Path
            id="horn1Body"
            d="M 181 55 C 181 46 183 37 187 28 C 190 21 194 17 196 19 C 194 26 191 35 188 44 C 186 51 184 56 181 55 Z"
            fill={accent}
          />
          <Path
            id="horn1Highlight"
            d="M 186 44 C 188 35 190 26 193 20 C 191 27 189 36 187 46 Z"
            fill={accentDark}
            opacity={0.45}
          />

          {/* Horn 2 – secondary forward horn */}
          <Path
            id="horn2Body"
            d="M 190 52 C 192 44 196 37 203 32 C 207 28 212 28 212 33 C 210 37 205 44 200 50 C 196 54 191 54 190 52 Z"
            fill={accent}
          />
          <Path
            id="horn2Highlight"
            d="M 200 50 C 205 44 209 37 212 33 C 210 37 205 44 200 52 Z"
            fill={accentDark}
            opacity={0.45}
          />

          {/* Small decorative horn spikes */}
          <Polygon id="hornSpike1" points="184,52 180,45 188,47" fill={accent} />
          <Polygon id="hornSpike2" points="197,48 193,41 201,45" fill={accent} />

        </G>

        {/* ════════════════════════════════════════ */}
        {/*  BREATH EFFECT  (hidden — opacity=0)   */}
        {/*  Set opacity > 0 and animate to reveal  */}
        {/* ════════════════════════════════════════ */}
        <G id="breathEffect" opacity={0}>
          <Path
            id="breathCore"
            d="M 226 88 C 234 82 242 78 244 84 C 242 91 234 93 226 91 Z"
            fill="#FFD700"
            opacity={0.95}
          />
          <Path
            id="breathOuter1"
            d="M 229 84 C 238 77 248 71 246 79 C 244 86 236 88 229 86 Z"
            fill="#FF8C00"
            opacity={0.85}
          />
          <Path
            id="breathOuter2"
            d="M 224 91 C 234 87 244 84 242 93 C 240 99 231 100 224 96 Z"
            fill="#FF3300"
            opacity={0.80}
          />
          <Path
            id="breathTip"
            d="M 244 84 C 248 80 252 78 250 85 C 248 90 244 91 244 88 Z"
            fill="#FFFFFF"
            opacity={0.70}
          />
        </G>

        {/* ════════════════════════════════════════ */}
        {/*  EYE GLOW EFFECT  (idle ambient)        */}
        {/* ════════════════════════════════════════ */}
        <G id="eyeGlow">
          <Circle cx="188" cy="63" r="12" fill="#B03020" opacity={0.07} />
        </G>

        {/* ════════════════════════════════════════ */}
        {/*  DEAD OVERLAY                           */}
        {/* ════════════════════════════════════════ */}
        {isDead && (
          <G id="deadOverlay">
            {/* X over eye */}
            <Path
              d="M 184 59 L 192 67 M 184 67 L 192 59"
              stroke="#D0D0D0"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </G>
        )}

      </Svg>

      {isDead && <Text style={styles.deadLabel}>DECEASED</Text>}
    </View>
  )
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  deadLabel: {
    color: '#C0C0C0',
    fontFamily: 'monospace',
    fontSize: 11,
    letterSpacing: 3,
    marginTop: 6,
  },
})