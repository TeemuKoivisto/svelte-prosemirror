// import { vi } from 'vitest'
import { htmlToDOMOutputSpec } from './htmlToDOMOutputSpec.js';

describe('htmlToDOMOutputSpec', () => {
	it('should generate simple paragraph output spec', () => {
		const paragraph = '<p data-indent data-hole></p>';
		const el = document.createElement('div');
		el.innerHTML = paragraph;
		const spec = htmlToDOMOutputSpec(el.firstChild as HTMLElement);
		expect(spec).toEqual(['p', { 'data-indent': '' }, 0]);
	});

	it('should generate more complicated figure spec (1)', async () => {
		const figure = `
<figure id>
  <img src="https://upload.wikimedia.org/wikipedia/en/7/70/Bob_at_Easel.jpg" alt>
  <figcaption data-hole></figcaption>
</figure>`;

		const el = document.createElement('div');
		el.innerHTML = figure.trim();
		const spec = htmlToDOMOutputSpec(el.firstChild as HTMLElement);
		expect(spec).toEqual([
			'figure',
			{ id: '' },
			[
				'img',
				{
					src: 'https://upload.wikimedia.org/wikipedia/en/7/70/Bob_at_Easel.jpg',
					alt: '',
				},
			],
			['figcaption', 0],
		]);
	});

	it('should generate more complicated figure spec (2)', async () => {
		const figure = `
<figure class="svelte-lu7br9">
  <figcaption data-hole="" class="svelte-lu7br9"></figcaption>
  <img src="https://upload.wikimedia.org/wikipedia/en/7/70/Bob_at_Easel.jpg" alt="Bob Ross in front of painting" title="">
</figure>`;

		const el = document.createElement('div');
		el.innerHTML = figure.trim();
		const spec = htmlToDOMOutputSpec(el.firstChild as HTMLElement);
		expect(spec).toEqual([
			'figure',
			{ class: 'svelte-lu7br9' },
			[
				'figcaption',
				{
					class: 'svelte-lu7br9',
				},
				0,
			],
			[
				'img',
				{
					src: 'https://upload.wikimedia.org/wikipedia/en/7/70/Bob_at_Easel.jpg',
					alt: 'Bob Ross in front of painting',
					title: '',
				},
			],
		]);
	});
});
