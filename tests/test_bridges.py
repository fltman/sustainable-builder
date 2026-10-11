"""The arched bridges' profile (pipeline/bridges.py, Venice's footbridges): a boat passes under the vault, the steps
can be walked, and the flights stay close to the quays they land on."""
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'pipeline'))
import bridges  # noqa: E402


class ArchedBridges(unittest.TestCase):
    def test_a_boat_passes_under_and_the_steps_can_be_walked(self):
        street = lambda x, y: 0.03
        for L in (2.5, 6.0, 9.2, 19.4, 40.0):
            pr = bridges.profile({'a': [0.0, 0.0], 'b': [L, 0.0], 'w': 2.4}, street, -1.2)
            self.assertGreaterEqual(pr['zi'] - pr['wz'], 1.9, L)            # headroom over the water
            self.assertGreater(pr['zc'], pr['zi'] + 0.3, L)                 # a deck over the vault
            self.assertGreaterEqual(pr['zc'] - 0.03, 0.5, L)                # the crown above the street
            for sf, zf, run, n in pr['feet']:
                self.assertLessEqual(abs(sf), L / 2 + 1.2 + 1e-9, L)        # at most 1.2 m onto the quay
                self.assertLessEqual((pr['zc'] - zf) / n, 0.2, L)           # risers of a stair, not a ladder
                self.assertGreaterEqual(run / n, 0.25, L)                   # treads a foot fits on

    def test_the_ground_sampler_matches_the_terrain_grid(self):
        t = {'x0': 0.0, 'y0': 0.0, 'step': 10.0, 'n': 2, 'd': [0.0, 1.0, 2.0, 3.0]}
        at = bridges.sampler(t, 0.5)
        self.assertAlmostEqual(at(0, 0), 0.5)
        self.assertAlmostEqual(at(5, 5), 2.0)                               # the mean of the four corners
        self.assertAlmostEqual(bridges.sampler(None, 0.03)(7, 7), 0.03)


if __name__ == '__main__':
    unittest.main()
