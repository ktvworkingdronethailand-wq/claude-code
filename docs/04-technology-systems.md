# KTV Working Drone Thailand - Technology Systems

## Fleet Composition

### Agricultural Fleet

| Aircraft | Startup Quantity | Scaled Quantity | Role |
|----------|-----------------|-----------------|------|
| DJI Agras T50 | 4 | 12 | Primary crop spraying platform |
| DJI Agras T25 | 2 | 4 | Secondary / small-field spraying |

- **Startup Investment**: THB 4.1 million

### Survey Fleet

| Aircraft | Startup Quantity | Scaled Quantity | Role |
|----------|-----------------|-----------------|------|
| DJI Matrice 350 RTK | 2 | 5 | Primary survey and mapping platform |
| DJI Mavic 3 Enterprise RTK | 2 | 4 | Lightweight survey and rapid deployment |

- **Startup Investment**: THB 1.5 million

### Inspection Fleet

| Aircraft | Startup Quantity | Scaled Quantity | Role |
|----------|-----------------|-----------------|------|
| DJI Matrice 30T | 2 | 4 | Primary thermal and visual inspection |
| DJI Mavic 3 Thermal | 1 | 2 | Lightweight thermal inspection |

- **Startup Investment**: THB 1.2 million

### Photo/Video Fleet

| Aircraft | Quantity | Role |
|----------|----------|------|
| DJI Inspire 3 | 1 | Premium cinematic capture |
| DJI Mavic 3 Pro Cine | 1 | Versatile professional video |
| DJI Mini 4 Pro | 1 | Lightweight, indoor, and confined spaces |

- **Startup Investment**: THB 954,000

### Fleet Investment Summary

| Phase | Total Fleet Investment (THB) |
|-------|------------------------------|
| Startup | 7.7 million |
| Scaled | 19 million |

---

## Payload Systems

| Payload | Application |
|---------|-------------|
| Zenmuse P1 | High-resolution photogrammetry (full-frame 45MP) |
| Mavic 3 Multispectral | NDVI and crop health analysis (multispectral imaging) |
| FLIR Vue TZ20-R | Radiometric thermal imaging for inspections |
| Zenmuse L2 | LiDAR scanning for terrain modeling and forestry |

---

## Software Stack

### Flight and Operations

| Software | Purpose |
|----------|---------|
| DJI FlightHub 2 | Fleet management, live tracking, mission planning |
| DJI Terra | Photogrammetry processing, 3D reconstruction |

### Data Processing and Analysis

| Software | Purpose |
|----------|---------|
| Pix4Dmapper | Professional photogrammetry and orthomosaic generation |
| Pix4Dfields | Agricultural analytics and prescription mapping |
| Agisoft Metashape | Advanced photogrammetry and dense point cloud generation |

### GIS and Mapping

| Software | Purpose |
|----------|---------|
| QGIS | Open-source GIS analysis and map production |
| ArcGIS | Enterprise GIS platform for advanced spatial analysis |

### Business Management

| Software | Purpose |
|----------|---------|
| Odoo ERP | Integrated business management (CRM, invoicing, inventory, HR) |

---

## IT Infrastructure

### Cloud Services

- **Primary Cloud**: AWS Bangkok region (ap-southeast-1)
- Used for data storage (S3), client portal hosting, backup, and scalable compute

### Processing Workstations

| Component | Specification |
|-----------|---------------|
| GPU | NVIDIA RTX 4090 |
| RAM | 128 GB |
| Purpose | Photogrammetry processing, 3D model generation, video editing |

### Storage

| System | Purpose |
|--------|---------|
| Synology NAS | On-premises network storage for raw data, processed outputs, and project archives |

### Client Portal

| Component | Technology |
|-----------|------------|
| Frontend | Next.js |
| Backend/Hosting | AWS (Lambda, API Gateway, S3, CloudFront) |
| Purpose | Secure deliverable access, project status tracking, download management |

---

## Vehicles and Field Equipment

### Vehicles

| Vehicle | Startup Quantity | Purpose |
|---------|-----------------|---------|
| Toyota Hilux Revo 4WD | 2 | Field transport, equipment hauling, remote site access |

### Portable Charging

| Equipment | Purpose |
|-----------|---------|
| DJI Generators | Field battery charging for DJI platforms |
| EcoFlow Delta Pro | Portable power station for equipment and workstations |

---

## Communication Systems

| System | Purpose |
|--------|---------|
| LINE Official Account | Primary client communication channel (54M Thai users) |
| UHF Radios | Field crew coordination during flight operations |
| Starlink | Satellite internet for remote operations without cellular coverage |

---

## Investment Summary

| Category | 3-Year Total Investment (THB) |
|----------|-------------------------------|
| All Categories Combined | 39.9 million |

---

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| DJI Ecosystem Lock-In | Best-in-class reliability, integrated flight planning, extensive payload compatibility, strong Thai dealer network and support |
| Hybrid Cloud + Local Processing | Large dataset processing done locally for speed; cloud used for storage, backup, and client delivery for scalability |
| LINE Integration | Essential communication channel in Thailand with 54M users; enables booking, updates, and customer service |
| Thai Regulatory Compliance | All systems, processes, and documentation designed for full CAAT compliance from day one |
