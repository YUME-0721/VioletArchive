<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import { getDefaultHue, getHue, setHue } from "@utils/setting-utils";
import { DARK_MODE, LIGHT_MODE, AUTO_MODE } from "@constants/constants.ts";
import { getStoredTheme, setTheme } from "@utils/setting-utils.ts";
import type { LIGHT_DARK_MODE } from "@/types/config.ts";

let hue = $state(getHue());
const defaultHue = getDefaultHue();

function resetHue() {
	hue = getDefaultHue();
}

$effect(() => {
	if (hue || hue === 0) {
		setHue(hue);
	}
});

const seq: LIGHT_DARK_MODE[] = [LIGHT_MODE, DARK_MODE, AUTO_MODE];
let mode: LIGHT_DARK_MODE = $state(getStoredTheme());
let isChanging = false;

function switchScheme(newMode: LIGHT_DARK_MODE) {
	if (isChanging) return;

	isChanging = true;
	mode = newMode;
	setTheme(newMode);

	setTimeout(() => {
		isChanging = false;
	}, 50);
}

function toggleScheme() {
	if (isChanging) return;

	let i = 0;
	for (; i < seq.length; i++) {
		if (seq[i] === mode) {
			break;
		}
	}
	switchScheme(seq[(i + 1) % seq.length]);
}

if (typeof window !== "undefined") {
	const handleContentReplace = () => {
		requestAnimationFrame(() => {
			const newMode = getStoredTheme();
			if (mode !== newMode) {
				mode = newMode;
			}
		});
	};

	if ((window as any).swup && (window as any).swup.hooks) {
		(window as any).swup.hooks.on("content:replace", handleContentReplace);
	} else {
		document.addEventListener("swup:enable", () => {
			if ((window as any).swup && (window as any).swup.hooks) {
				(window as any).swup.hooks.on("content:replace", handleContentReplace);
			}
		});
	}

	document.addEventListener("DOMContentLoaded", () => {
		requestAnimationFrame(() => {
			const newMode = getStoredTheme();
			if (mode !== newMode) {
				mode = newMode;
			}
		});
	});

	// 监听系统主题偏好变化
	const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
	const handleSystemThemeChange = () => {
		if (mode === AUTO_MODE) {
			setTheme(AUTO_MODE);
		}
	};
	
	mediaQuery.addEventListener("change", handleSystemThemeChange);
}
</script>

<div id="display-setting" class="float-panel float-panel-closed absolute transition-all w-80 right-4 px-4 py-4">
    <div class="flex flex-row gap-2 mb-3 items-center justify-between">
        <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
            before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
            before:absolute before:-left-3 before:top-[0.33rem]"
        >
            {i18n(I18nKey.themeColor)}
            <button aria-label="Reset to Default" class="btn-regular w-7 h-7 rounded-md  active:scale-90"
                    class:opacity-0={hue === defaultHue} class:pointer-events-none={hue === defaultHue} onclick={resetHue}>
                <div class="text-[var(--btn-content)]">
                    <Icon icon="fa6-solid:arrow-rotate-left" class="text-[0.875rem]"></Icon>
                </div>
            </button>
        </div>
        <div class="flex gap-1">
            <div id="hueValue" class="transition bg-[var(--btn-regular-bg)] w-10 h-7 rounded-md flex justify-center
            font-bold text-sm items-center text-[var(--btn-content)]">
                {hue}
            </div>
        </div>
    </div>
    <div class="w-full h-6 px-1 bg-[oklch(0.80_0.10_0)] dark:bg-[oklch(0.70_0.10_0)] rounded select-none mb-4">
        <input aria-label={i18n(I18nKey.themeColor)} type="range" min="0" max="360" bind:value={hue}
               class="slider" id="colorSlider" step="5" style="width: 100%">
    </div>
    <div class="flex flex-row gap-2 mb-3 items-center justify-between">
        <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
            before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
            before:absolute before:-left-3 before:top-[0.33rem]"
        >
            主题模式
        </div>
    </div>
    <div class="flex gap-2">
        <button 
            aria-label="Light Mode" 
            class="flex-1 btn-regular rounded-md py-2 px-4 active:scale-90 transition"
            class:bg-[var(--btn-regular-bg)]={mode === LIGHT_MODE}
            class:bg-[var(--card-bg)]={mode !== LIGHT_MODE}
            class:opacity-50={mode !== LIGHT_MODE}
            onclick={() => switchScheme(LIGHT_MODE)}
        >
            <div class="flex flex-col items-center gap-1">
                <Icon icon="material-symbols:wb-sunny-outline-rounded" class="text-[1.5rem] text-[var(--btn-content)]"></Icon>
                <span class="text-sm text-[var(--btn-content)]">浅色</span>
            </div>
        </button>
        <button 
            aria-label="Dark Mode" 
            class="flex-1 btn-regular rounded-md py-2 px-4 active:scale-90 transition"
            class:bg-[var(--btn-regular-bg)]={mode === DARK_MODE}
            class:bg-[var(--card-bg)]={mode !== DARK_MODE}
            class:opacity-50={mode !== DARK_MODE}
            onclick={() => switchScheme(DARK_MODE)}
        >
            <div class="flex flex-col items-center gap-1">
                <Icon icon="material-symbols:dark-mode-outline-rounded" class="text-[1.5rem] text-[var(--btn-content)]"></Icon>
                <span class="text-sm text-[var(--btn-content)]">深色</span>
            </div>
        </button>
        <button 
            aria-label="Auto Mode" 
            class="flex-1 btn-regular rounded-md py-2 px-4 active:scale-90 transition"
            class:bg-[var(--btn-regular-bg)]={mode === AUTO_MODE}
            class:bg-[var(--card-bg)]={mode !== AUTO_MODE}
            class:opacity-50={mode !== AUTO_MODE}
            onclick={() => switchScheme(AUTO_MODE)}
        >
            <div class="flex flex-col items-center gap-1">
                <Icon icon="material-symbols:hdr-auto-outline" class="text-[1.5rem] text-[var(--btn-content)]"></Icon>
                <span class="text-sm text-[var(--btn-content)]">自动</span>
            </div>
        </button>
    </div>
</div>


<style lang="stylus">
    #display-setting
      input[type="range"]
        -webkit-appearance none
        height 1.5rem
        background-image var(--color-selection-bar)
        transition background-image 0.15s ease-in-out

        /* Input Thumb */
        &::-webkit-slider-thumb
          -webkit-appearance none
          height 1rem
          width 0.5rem
          border-radius 0.125rem
          background rgba(255, 255, 255, 0.7)
          box-shadow none
          &:hover
            background rgba(255, 255, 255, 0.8)
          &:active
            background rgba(255, 255, 255, 0.6)

        &::-moz-range-thumb
          -webkit-appearance none
          height 1rem
          width 0.5rem
          border-radius 0.125rem
          border-width 0
          background rgba(255, 255, 255, 0.7)
          box-shadow none
          &:hover
            background rgba(255, 255, 255, 0.8)
          &:active
            background rgba(255, 255, 255, 0.6)

        &::-ms-thumb
          -webkit-appearance none
          height 1rem
          width 0.5rem
          border-radius 0.125rem
          background rgba(255, 255, 255, 0.7)
          box-shadow none
          &:hover
            background rgba(255, 255, 255, 0.8)
          &:active
            background rgba(255, 255, 255, 0.6)

</style>
