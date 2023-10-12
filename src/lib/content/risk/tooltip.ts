export const Tooltip: {
	tooltip: HTMLElement | undefined | null;
	target: HTMLElement | undefined | null;
	bindEvents: () => void;
	show: (ev: Event) => void;
	hide: () => void;
} = {
	tooltip: null,
	target: null,
	bindEvents: function () {
		Tooltip.tooltip = document.getElementById('whe-tooltip');
		const targets = document.querySelectorAll('[rel=whe-tooltip]');
		for (let i = 0; i < targets.length; ++i) {
			targets[i].addEventListener('click', Tooltip.show);
			targets[i].addEventListener('mouseenter', Tooltip.show);
			targets[i].addEventListener('mouseleave', Tooltip.hide);
		}
		Tooltip.tooltip?.addEventListener('click', Tooltip.hide);
		window.addEventListener('resize', Tooltip.show);
	},

	show: function (ev: Event) {
		Tooltip.hide();
		Tooltip.target = ev.target as HTMLElement;
		if (!Tooltip.tooltip || !Tooltip.target) {
			return false;
		}
		const tip = Tooltip.target.getAttribute('whe-tooltip-text');
		if (!tip || tip == '') {
			return false;
		}
		Tooltip.tooltip.className = '';
		Tooltip.tooltip.innerHTML = tip;
		const targetDomRect = Tooltip.target.getBoundingClientRect();
		const targetLeft = targetDomRect.left;
		const targetTop = targetDomRect.top + window.scrollY;
		if (window.innerWidth < Tooltip.tooltip.offsetWidth * 1.5) {
			Tooltip.tooltip.style.maxWidth = window.innerWidth / 2 + 'px';
		} else {
			Tooltip.tooltip.style.maxWidth = 320 + 'px';
		}

		// eslint-disable-next-line no-var
		var pos_left = targetLeft + Tooltip.target.offsetWidth / 2 - Tooltip.tooltip.offsetWidth / 2,
			pos_top = targetTop - Tooltip.tooltip.offsetHeight - 20;
		Tooltip.tooltip.className = '';
		if (pos_left < 0) {
			pos_left = targetLeft + Tooltip.target.offsetWidth / 2 - 20;
			Tooltip.tooltip.className += ' whe-left';
		}

		if (pos_left + Tooltip.tooltip.offsetWidth > window.innerWidth) {
			pos_left = targetLeft - Tooltip.tooltip.offsetWidth + Tooltip.target.offsetWidth / 2 + 20;
			Tooltip.tooltip.className += ' whe-right';
		}

		if (pos_top < 0) {
			// eslint-disable-next-line no-var
			var pos_top = targetTop + Tooltip.target.offsetHeight;
			Tooltip.tooltip.className += ' whe-top';
		}

		Tooltip.tooltip.style.left = pos_left + 'px';
		Tooltip.tooltip.style.top = pos_top + 'px';

		Tooltip.tooltip.className += ' whe-show';
	},
	hide: function () {
		if (!Tooltip.tooltip) {
			return;
		}
		Tooltip.tooltip.className = Tooltip.tooltip.className.replace('whe-show', '');
	}
};

export const initTooltip = () => {
	document.body.insertAdjacentHTML('afterbegin', '<div id="whe-tooltip"></div>');
};
