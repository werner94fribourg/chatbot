import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { NextPage } from 'next';

const Table: NextPage<{ rows: object[]; columns: GridColDef[] }> = props => {
  const { rows, columns } = props;

  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
        autoHeight={true}
      />
    </div>
  );
};

export default Table;
