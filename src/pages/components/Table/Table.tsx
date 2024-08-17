import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { NextPage } from 'next';

const Table: NextPage<{
  rows: object[];
  columns: GridColDef[];
  loading: boolean;
}> = props => {
  const { rows, columns, loading } = props;

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
        loading={loading}
        slotProps={{
          loadingOverlay: {
            variant: 'linear-progress',
            noRowsVariant: 'skeleton',
          },
        }}
      />
    </div>
  );
};

export default Table;
