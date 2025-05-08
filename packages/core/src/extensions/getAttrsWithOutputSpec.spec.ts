// import { vi } from 'vitest'
import { getAttrsWithOutputSpec } from './getAttrsWithOutputSpec.js';

describe('getAttrsWithOutputSpec', () => {
	it('should get attributes from simple paragraph (1)', () => {
		const paragraph = '<p data-indent="3" data-hole></p>';
		const el = document.createElement('div');
		el.innerHTML = paragraph;
		const spec = ['p', { 'data-indent': '' }, 0];
		const attrs = getAttrsWithOutputSpec(spec, el, { selector: [] });
		expect(attrs).toEqual({
			'data-indent': 3,
		});
	});

	it('should get attributes from simple paragraph (2)', () => {
		const paragraph = '<p data-indent class="hidden" title="hello" data-hole>text</p>';
		const el = document.createElement('div');
		el.innerHTML = paragraph;
		const spec = ['p', { 'data-indent': null, class: '' }, 0];
		const attrs = getAttrsWithOutputSpec(spec, el, { selector: [] });
		expect(attrs).toEqual({
			'data-indent': '',
			class: 'hidden',
		});
	});

	it('should get attributes from more complicated figure (1)', async () => {
		const figure = `
<figure id>
  <img src="https://upload.wikimedia.org/wikipedia/en/7/70/Bob_at_Easel.jpg" alt>
  <figcaption data-hole></figcaption>
</figure>`;

		const el = document.createElement('div');
		el.innerHTML = figure.trim();
		const spec = [
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
		];
		const attrs = getAttrsWithOutputSpec(spec, el, { selector: [] });
		expect(attrs).toEqual({
			id: '',
			src: 'https://upload.wikimedia.org/wikipedia/en/7/70/Bob_at_Easel.jpg',
			alt: '',
		});
	});

	it('should get attributes from more complicated figure (2)', async () => {
		const figure = `
<figure class="svelte-lu7br9">
  <figcaption data-hole="" class="svelte-lu7br9"></figcaption>
  <img src="https://upload.wikimedia.org/wikipedia/en/7/70/Bob_at_Easel.jpg" alt="Bob Ross in front of painting" title="">
</figure>`;

		const el = document.createElement('div');
		el.innerHTML = figure.trim();
		const spec = [
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
		];
		const attrs = getAttrsWithOutputSpec(spec, el, { selector: [] });
		expect(attrs).toEqual({
			src: 'https://upload.wikimedia.org/wikipedia/en/7/70/Bob_at_Easel.jpg',
			alt: 'Bob Ross in front of painting',
		});
	});
});
