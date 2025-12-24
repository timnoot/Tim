from math import *
import numpy as np
import matplotlib.pyplot as plt

points = [
    (0, 0),  # 0
    (350, 0),  # 1
    (1125, 1300),  # 2
    (0, 950),  # 3
]

parts = [
    (0, 1),
    (0, 2),
    (2, 3),
    (0, 3),
    (1, 3),
]

point_loads = {  # point: (Fx, Fy, M)
    2: (0, -700, 0),
}

x_supports = [  # points
    0,
]

y_supports = [0, 1]  # points


def find_length(p1: tuple[0, 0], p2: tuple[0, 0]):
    """Find length between two 2D points"""
    return sqrt(abs(p1[0] - p2[0]) ** 2 + abs(p1[1] - p2[1]) ** 2)


part_lengths = [find_length(points[p1], points[p2]) for p1, p2 in parts]


if len(x_supports) + len(y_supports) > 3:
    raise NameError("Too many supports")

moment_point = x_supports[0]  # anti clockwise positive

matrix = [
    # x1, x2, x3, b
    [0, 0, 0, 0],  # sum Fx
    [0, 0, 0, 0],  # sum Fy
    [0, 0, 0, 0],  # sum M0
]


def moment_calculation(moment_point, load_point, fx, fy, M):
    d_x = points[load_point][0] - points[moment_point][0]
    d_y = points[load_point][1] - points[moment_point][1]
    return M + fy * d_x - fx * d_y


for p, (fx, fy, M) in point_loads.items():
    matrix[0][3] += fx
    matrix[1][3] += fy
    matrix[2][3] += moment_calculation(moment_point, p, fx, fy, M)


for i, p in enumerate(x_supports):
    matrix[0][i] = 1  # x support

for i, p in enumerate(y_supports):
    matrix[1][i + len(x_supports)] = 1  # y support


for i, p in enumerate(set(x_supports + y_supports)):
    print(i, p)

    if moment_point == p:
        continue

    if p in x_supports:
        matrix[2][i] = (
            points[p][1] - points[moment_point][1]
        )  # moment arm for x support
    if p in y_supports:
        matrix[2][i] = (
            points[p][0] - points[moment_point][0]
        )  # moment arm for y support


def solve_matrix(m):
    a = np.array([row[:-1] for row in m])
    b = np.array([row[-1] for row in m])
    solution = np.linalg.solve(a, b)
    return solution


print(matrix)
solution = solve_matrix(matrix)
print("Support Reactions:")
for i, val in enumerate(solution):
    print(f"R{i + 1} = {val:.2f} N")

# calculate internal forces in parts
