class Node {
  constructor(position, parent = null) {
    this.position = position; // { x, y }
    this.parent = parent;
    this.g = 0; // Custo do caminho do início até este nó
    this.h = 0; // Heurística (distância estimada até o destino)
    this.f = 0; // Custo total (g + h)
  }

  // Método para comparar nós baseado na posição
  equals(other) {
    return this.position.x === other.position.x && this.position.y === other.position.y;
  }
}

class PathfindingService {
  constructor() {
    this.directions = [
      { dx: 0, dy: -1 },  // cima
      { dx: 1, dy: 0 },   // direita
      { dx: 0, dy: 1 },   // baixo
      { dx: -1, dy: 0 },  // esquerda
      // Diagonais
      { dx: -1, dy: -1 }, // superior esquerdo
      { dx: 1, dy: -1 },  // superior direito
      { dx: -1, dy: 1 },  // inferior esquerdo
      { dx: 1, dy: 1 }    // inferior direito
    ];
  }

  // Calcula a distância de Manhattan entre dois pontos (heurística)
  calculateHeuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  // Verifica se uma posição está dentro dos limites do mapa
  isWithinBounds(position, width, height) {
    return position.x >= 0 && position.x < width && 
           position.y >= 0 && position.y < height;
  }

  // Verifica se uma posição é um obstáculo
  isObstacle(position, obstacles) {
    return obstacles.some(obs => 
      position.x >= obs.position.x - Math.floor(obs.size/2) &&
      position.x <= obs.position.x + Math.floor(obs.size/2) &&
      position.y >= obs.position.y - Math.floor(obs.size/2) &&
      position.y <= obs.position.y + Math.floor(obs.size/2)
    );
  }

  // Verifica se um caminho entre dois pontos é válido (sem obstáculos)
  isPathClear(start, end, obstacles) {
    // Algoritmo de linha de Bresenham para verificar obstáculos na linha
    let x0 = start.x;
    let y0 = start.y;
    const x1 = end.x;
    const y1 = end.y;
    
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = (x0 < x1) ? 1 : -1;
    const sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    while (true) {
      // Verifica se a posição atual é um obstáculo
      if (this.isObstacle({ x: x0, y: y0 }, obstacles)) {
        return false;
      }

      if (x0 === x1 && y0 === y1) break;
      
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x0 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y0 += sy;
      }
    }
    
    return true;
  }

  // Encontra o caminho usando o algoritmo A*
  async findPath(map, start, end, obstacles, waypoints = []) {
    // Validação básica
    if (!this.isWithinBounds(start, map.width, map.height) || 
        !this.isWithinBounds(end, map.width, map.height)) {
      throw new Error('Start or end position is out of bounds');
    }

    // Verifica se o ponto de início ou fim está em um obstáculo
    if (this.isObstacle(start, obstacles)) {
      throw new Error('Start position is on an obstacle');
    }
    
    if (this.isObstacle(end, obstacles)) {
      throw new Error('End position is on an obstacle');
    }

    // Se não houver waypoints, encontra o caminho direto
    if (waypoints.length === 0) {
      return this.findSinglePath(start, end, map, obstacles);
    }

    // Se houver waypoints, encontra o caminho passando por eles na ordem
    let currentStart = start;
    let fullPath = [];
    let totalDistance = 0;
    
    // Adiciona o destino final como último waypoint
    const allWaypoints = [...waypoints, end];
    
    for (const waypoint of allWaypoints) {
      try {
        const pathSegment = await this.findSinglePath(currentStart, waypoint, map, obstacles);
        
        if (pathSegment.path.length === 0) {
          throw new Error(`No path found to waypoint at (${waypoint.x}, ${waypoint.y})`);
        }
        
        // Adiciona o segmento ao caminho completo (exceto o primeiro ponto para evitar duplicação)
        fullPath = [...fullPath, ...pathSegment.path.slice(1)];
        totalDistance += pathSegment.distance;
        currentStart = waypoint;
      } catch (error) {
        throw new Error(`Error finding path to waypoint at (${waypoint.x}, ${waypoint.y}): ${error.message}`);
      }
    }
    
    return {
      path: [start, ...fullPath],
      distance: totalDistance
    };
  }

  // Encontra um caminho único entre dois pontos usando A*
  async findSinglePath(start, end, map, obstacles) {
    // Cria os nós inicial e final
    const startNode = new Node(start);
    const endNode = new Node(end);
    
    // Lista de nós abertos (a serem avaliados)
    const openList = [startNode];
    // Lista de nós fechados (já avaliados)
    const closedList = [];
    
    // Enquanto houver nós para avaliar
    while (openList.length > 0) {
      // Encontra o nó com o menor custo f na lista aberta
      let currentNode = openList[0];
      let currentIndex = 0;
      
      for (let i = 1; i < openList.length; i++) {
        if (openList[i].f < currentNode.f) {
          currentNode = openList[i];
          currentIndex = i;
        }
      }
      
      // Remove o nó atual da lista aberta e adiciona à lista fechada
      openList.splice(currentIndex, 1);
      closedList.push(currentNode);
      
      // Se chegamos ao destino, reconstrói o caminho
      if (currentNode.equals(endNode)) {
        const path = [];
        let current = currentNode;
        
        while (current) {
          path.unshift(current.position);
          current = current.parent;
        }
        
        return {
          path,
          distance: currentNode.g
        };
      }
      
      // Gera os nós vizinhos
      const neighbors = [];
      
      for (const dir of this.directions) {
        const neighborPos = {
          x: currentNode.position.x + dir.dx,
          y: currentNode.position.y + dir.dy
        };
        
        // Verifica se a posição está dentro dos limites do mapa
        if (!this.isWithinBounds(neighborPos, map.width, map.height)) {
          continue;
        }
        
        // Verifica se a posição é um obstáculo
        if (this.isObstacle(neighborPos, obstacles)) {
          continue;
        }
        
        // Cria um novo nó vizinho
        const neighbor = new Node(neighborPos, currentNode);
        neighbors.push(neighbor);
      }
      
      // Processa cada vizinho
      for (const neighbor of neighbors) {
        // Se o vizinho já estiver na lista fechada, pula
        if (closedList.some(node => node.equals(neighbor))) {
          continue;
        }
        
        // Calcula os valores g, h e f
        // O custo para se mover para um vizinho é 1 para lados e √2 para diagonais
        const isDiagonal = Math.abs(neighbor.position.x - currentNode.position.x) === 1 && 
                          Math.abs(neighbor.position.y - currentNode.position.y) === 1;
        const movementCost = isDiagonal ? Math.SQRT2 : 1;
        
        const gScore = currentNode.g + movementCost;
        let gScoreIsBest = false;
        
        // Se o vizinho não estiver na lista aberta, adiciona
        if (!openList.some(node => node.equals(neighbor))) {
          gScoreIsBest = true;
          neighbor.h = this.calculateHeuristic(neighbor.position, endNode.position);
          openList.push(neighbor);
        } 
        // Se encontramos um caminho melhor para este nó
        else if (gScore < neighbor.g) {
          gScoreIsBest = true;
        }
        
        // Se este caminho para o vizinho for melhor, atualiza os valores
        if (gScoreIsBest) {
          neighbor.parent = currentNode;
          neighbor.g = gScore;
          neighbor.f = neighbor.g + neighbor.h;
        }
      }
    }
    
    // Se chegamos aqui, não há caminho
    return {
      path: [],
      distance: 0
    };
  }
}

module.exports = new PathfindingService();
